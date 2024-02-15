// index.js
const express = require('express');
const exceljs = require('exceljs');
const fs = require('fs');
const { sequelize, UsersCointabs, Posts } = require('./config/db'); // Assuming your models are in the models directory
const cors = require('cors')
const app = express();
app.use(cors())
app.use(express.json())


// Routes
app.get('/', (req, res) => {
    res.send('Hello, this is your Node.js Express server with Sequelize and PostgreSQL!');
});

app.get('/checkUser/:userId', async (req, res) => {
    try {
        await checkTableExistence();

        const userId = req.params.userId;

        const user = await UsersCointabs.findOne({
            where: {
                id: userId,
            },
        });

        const isPresent = !!user;

        res.json({ isPresent });
    } catch (error) {
        console.error('Error checking user presence:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/checkPost/:userId/:postId', async (req, res) => {

    try {
        await checkTableExistence();
        const userId = req.params.userId;
        const postId = req.params.postId;

        const post = await Posts.findOne({
            where: {
                userId: userId,
                id: postId,
            },
        });

        if (post) {

            res.json({ isPresent: true });
        } else {
            res.json({ isPresent: false });
        }
    } catch (error) {
        console.error('Error checking post presence:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route to bulk add posts for a user
app.post('/bulkAddPosts/:userId', async (req, res) => {
    try {
        await checkTableExistence();

        const userId = req.params.userId;
        const postsData = req.body.posts;
        const user = await UsersCointabs.findByPk(userId);
        if (user) {
            const createdPosts = await Posts.bulkCreate(
                postsData.map((post) => ({
                    Title: post.title,
                    Body: post.body,
                    Company: user.Company,
                    userId: user.id,
                }))
            );

            res.json({ success: true, createdPosts });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error bulk adding posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/downloadExcel/:userId', async (req, res) => {
    try {
        await checkTableExistence();

        const userId = req.params.userId;

        // Fetch all posts for the specified userId
        const posts = await Posts.findAll({
            where: { userId },
        });

        if (posts.length === 0) {
            res.status(404).json({ error: 'No posts found for the user' });
            return;
        }

        // Create a new Excel workbook and worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Posts');

        worksheet.columns = [
            { header: 'Title', key: 'title', width: 20 },
            { header: 'Body', key: 'body', width: 40 },
            { header: 'Company', key: 'company', width: 20 },
            // Add more columns as needed
        ];


        // Add data to the worksheet
        posts.forEach((post) => {
            worksheet.addRow({
                title: post.Title,
                body: post.Body,
                company: post.Company,
                // Add more data as needed
            });
        });

        // Set content type and disposition including desired filename
        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        res.setHeader(
            'Content-Disposition',
            `attachment; filename=posts_${userId}.xlsx`
        );

        // Pipe the workbook directly to the response stream
        await workbook.xlsx.write(res);

        // End the response stream
        res.end();
    } catch (error) {
        console.error('Error downloading Excel:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/addUser', async (req, res) => {
    try {
        await checkTableExistence();

        const { user } = req.body;

        // Check if the user with the given userId already exists
        const existingUser = await UsersCointabs.findOne({
            where: {
                id: user.id,
            },
        });

        if (existingUser) {
            // User already exists, return an error or appropriate response
            return res.status(400).json({ error: 'User already exists' });
        }

        // Add the user to the UsersCointab table
        const newUser = await UsersCointabs.create({
            id: user.id,
            Name: user.name,
            Email: user.email,
            Phone: user.phone,
            Website: user.website,
            City: user.address.city,
            Company: user.company.name,
        });

        // Return a success response
        res.json({ isPresent: true, user: newUser });
    } catch (error) {
        console.error('Error adding user:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



async function checkTableExistence() {
  try {
    await sequelize.sync(); // This will create the tables if they don't exist
    console.log('Tables are in sync');
  } catch (error) {
    console.error('Error syncing tables:', error);
  }
}



// Sync Sequelize models with the database and start the server
sequelize.sync({ force: false }) // Set force to true to drop tables and recreate on every server start
    .then(() => {
        app.listen(4000, () => {
            console.log(`Server is running on port 4000`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });
