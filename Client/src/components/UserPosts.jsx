import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2'

const UserPosts = () => {
  const { userId, company } = useParams();
  const [posts, setPosts] = useState([]);
  const [showBulkAdd, setShowBulkAdd] = useState(false);

  useEffect(() => {
    // Fetch posts for the specific userId
    fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
      .then((response) => response.json())
      .then((data) => {
        // Create an array of promises for checking post presence
        const checkPresencePromises = data.map((post) =>
          fetch(`https://gorgeous-outfit-fawn.cyclic.app/checkPost/${userId}/${post.id}`)
            .then((response) => response.json())
            .then((result) => result)
            .catch((error) =>
              console.error(`Error checking post presence for ${post.id}:`, error)
            )
        );

        // Wait for all promises to resolve
        Promise.all(checkPresencePromises)
          .then((results) => {
            // Update the posts with isPresent property
            const updatedPosts = data.map((post, index) => ({
              ...post,
              isPresent: results[index].isPresent,
            }));

            // Update the state
            setPosts(updatedPosts);
          })
          .catch((error) => console.error('Error checking post presence:', error));
      })
      .catch((error) => console.error(`Error fetching posts for user ${userId}:`, error));
  }, [userId]);

  // Function to handle bulk adding posts
  const handleBulkAdd = () => {
    // Filter out posts that are already present in the database
    const postsToAdd = posts.filter((post) => !post.isPresent);

    // If there are posts to add, make the bulk add request
    if (postsToAdd.length > 0) {
      fetch(`https://gorgeous-outfit-fawn.cyclic.app/bulkAddPosts/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          posts: postsToAdd,
        }),
      })
        .then((response) => response.json())
        .then((result) => {
          Swal.fire({
            icon: "success",
            title: "Your work has been saved",
            showConfirmButton: false,
            timer: 1500
          });

          setPosts((prevPosts) =>
            prevPosts.map((prevPost) =>
              postsToAdd.some((addedPost) => addedPost.id === prevPost.id)
                ? { ...prevPost, isPresent: true }
                : prevPost
            )
          );
          
        })
        .catch((error) => console.error('Error bulk adding posts:', error));
    }
  };


  const handleDownloadExcel = () => {
    
    // Make a GET request to the backend route for downloading Excel
    fetch(`https://gorgeous-outfit-fawn.cyclic.app/downloadExcel/${userId}`)
      .then((response) => response.blob())
      .then((blob) => {
        Swal.fire({
          icon: "success",
          title: "File Downloaded",
          showConfirmButton: false,
          timer: 1500
        });
        // Create a URL for the blob
        const url = window.URL.createObjectURL(new Blob([blob]));

        // Create a link element
        const link = document.createElement('a');
        link.href = url;

        // Set the filename for the download
        link.setAttribute('download', `posts_${userId}.xlsx`);

        // Append the link to the body
        document.body.appendChild(link);

        // Trigger a click on the link to start the download
        link.click();

        // Remove the link from the body
        document.body.removeChild(link);
        
      })
      .catch((error) => console.error('Error downloading Excel:', error));
  };

  // Use useEffect to update the button state after bulk addition
  useEffect(() => {
    // Check if any post is not present to determine which button to show
    const isAnyPostNotPresent = posts.some((post) => !post.isPresent);
    setShowBulkAdd(isAnyPostNotPresent);
  }, [posts]);

  return (
    <>
      <div>
        {showBulkAdd ? (
          <button onClick={handleBulkAdd}>Bulk Add</button>
        ) : (
          <button onClick={handleDownloadExcel}>Download In Excel</button>
        )}
      </div>
      <div className="user-grid">
        {posts.map((post) => (
          <div key={post.id} className="user-card">
            <h3>Name: {post.userId}</h3>
            <h3>Title: {post.title}</h3>
            <p>Body: {post.body}</p>
            <p>Company: {company}</p>
          </div>
        ))}
      </div>
    </>
  );
};

export default UserPosts;
