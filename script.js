let posts = [];
let circles = [];
let linkscore = 0;
let currentUser = null;

function signIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (isUsernameAvailable(username)) {
            currentUser = username;
            document.getElementById('auth-message').innerText = `Welcome, ${username}!`;
            document.getElementById('auth-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';
            updateProfile();
        } else {
            document.getElementById('auth-message').innerText = 'Username already taken.';
        }
    } else {
        document.getElementById('auth-message').innerText = 'Please enter username and password.';
    }
}

function logIn() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        if (isValidLogin(username, password)) {
            currentUser = username;
            document.getElementById('auth-message').innerText = `Logged in as ${username}!`;
            document.getElementById('auth-page').style.display = 'none';
            document.getElementById('main-page').style.display = 'block';
            updateProfile();
        } else {
            document.getElementById('auth-message').innerText = 'Wrong password.';
        }
    } else {
        document.getElementById('auth-message').innerText = 'Please enter username and password.';
    }
}

function logout() {
    currentUser = null;
    posts = [];
    circles = [];
    linkscore = 0;
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('auth-page').style.display = 'flex';
    document.getElementById('auth-message').innerText = '';
    updateProfile();
}

function createPost() {
    const postContent = document.getElementById('post-content').value;
    if (postContent && currentUser) {
        posts.push({ content: postContent, user: currentUser, likes: 0, likedBy: [], comments: [] });
        document.getElementById('post-content').value = '';
        displayPosts();
        updateLinkScore();
    }
}

function displayPosts() {
    const postsContainer = document.getElementById('posts');
    postsContainer.innerHTML = '';
    posts.forEach((post, index) => {
        postsContainer.innerHTML += `
            <div class="post">
                <p><strong>${post.user}:</strong> ${post.content}</p>
                <button onclick="toggleLikePost(${index})">👍 (${formatLikes(post.likes)})</button>
                <button onclick="toggleComments(${index})">Expand</button>
                <button class="delete-button" onclick="deletePost(${index})" ${post.user !== currentUser ? 'style="display: none;"' : ''}>Delete</button>
                <div class="comment-section" id="comments-${index}" style="display: none;">
                    <textarea placeholder="Add a comment"></textarea>
                    <button onclick="addComment(${index})">Comment</button>
                    <div id="comments-list-${index}"></div>
                </div>
            </div>
        `;
    });
}

function toggleLikePost(index) {
    const post = posts[index];
    const userLiked = post.likedBy.includes(currentUser);
    
    if (userLiked) {
        post.likes--;
        post.likedBy = post.likedBy.filter(user => user !== currentUser);
    } else {
        post.likes++;
        post.likedBy.push(currentUser);
    }
    
    updateLinkScore();
    displayPosts();
}

function toggleComments(index) {
    const commentsSection = document.getElementById(`comments-${index}`);
    commentsSection.style.display = commentsSection.style.display === 'block' ? 'none' : 'block';
}

function addComment(index) {
    const commentContent = document.querySelector(`#comments-${index} textarea`).value;
    if (commentContent) {
        posts[index].comments.push({ user: currentUser, content: commentContent, likes: 0, likedBy: [] });
        document.querySelector(`#comments-${index} textarea`).value = '';
        displayComments(index);
        updateLinkScore();
    }
}

function displayComments(index) {
    const commentsList = document.getElementById(`comments-list-${index}`);
    commentsList.innerHTML = '';
    posts[index].comments.forEach((comment, commentIndex) => {
        commentsList.innerHTML += `
            <p>
                <strong>${comment.user}:</strong> ${comment.content}
                <button onclick="toggleLikeComment(${index}, ${commentIndex})">👍 (${formatLikes(comment.likes)})</button>
                <button class="delete-button" onclick="deleteComment(${index}, ${commentIndex})" ${comment.user !== currentUser ? 'style="display: none;"' : ''}>Delete</button>
            </p>
        `;
    });
}

function toggleLikeComment(postIndex, commentIndex) {
    const comment = posts[postIndex].comments[commentIndex];
    const userLiked = comment.likedBy.includes(currentUser);
    
    if (userLiked) {
        comment.likes--;
        comment.likedBy = comment.likedBy.filter(user => user !== currentUser);
    } else {
        comment.likes++;
        comment.likedBy.push(currentUser);
    }
    
    displayComments(postIndex);
    updateLinkScore();
}

function deletePost(index) {
    if (posts[index].user === currentUser) {
        posts.splice(index, 1);
        displayPosts();
        updateLinkScore();
    }
}

function deleteComment(postIndex, commentIndex) {
    if (posts[postIndex].comments[commentIndex].user === currentUser) {
        posts[postIndex].comments.splice(commentIndex, 1);
        displayComments(postIndex);
        updateLinkScore();
    }
}

function createCircle() {
    const circleName = document.getElementById('circle-name').value;
    if (circleName && currentUser) {
        circles.push({ name: circleName, user: currentUser, likes: 0, likedBy: [], comments: [] });
        document.getElementById('circle-name').value = '';
        displayCircles();
        updateLinkScore();
    }
}

function displayCircles() {
    const circleList = document.getElementById('circle-list');
    circleList.innerHTML = '';
    circles.forEach((circle, index) => {
        circleList.innerHTML += `
            <div class="circle">
                <p><strong>${circle.user}:</strong> ${circle.name} <button onclick="toggleLikeCircle(${index})">👍 (${formatLikes(circle.likes)})</button></p>
                <button onclick="toggleCircleComments(${index})">Expand</button>
                <button class="delete-button" onclick="deleteCircle(${index})" ${circle.user !== currentUser ? 'style="display: none;"' : ''}>Delete</button>
                <div class="comment-section" id="circle-comments-${index}" style="display: none;">
                    <textarea placeholder="Add a comment"></textarea>
                    <button onclick="addCircleComment(${index})">Comment</button>
                    <div id="circle-comments-list-${index}"></div>
                </div>
            </div>
        `;
    });
}

function toggleLikeCircle(index) {
    const circle = circles[index];
    const userLiked = circle.likedBy.includes(currentUser);
    
    if (userLiked) {
        circle.likes--;
        circle.likedBy = circle.likedBy.filter(user => user !== currentUser);
    } else {
        circle.likes++;
        circle.likedBy.push(currentUser);
    }
    
    updateLinkScore();
    displayCircles();
}

function toggleCircleComments(index) {
    const circleCommentsSection = document.getElementById(`circle-comments-${index}`);
    circleCommentsSection.style.display = circleCommentsSection.style.display === 'block' ? 'none' : 'block';
}

function addCircleComment(index) {
    const commentContent = document.querySelector(`#circle-comments-${index} textarea`).value;
    if (commentContent) {
        circles[index].comments.push({ user: currentUser, content: commentContent, likes: 0, likedBy: [] });
        document.querySelector(`#circle-comments-${index} textarea`).value = '';
        displayCircleComments(index);
        updateLinkScore();
    }
}

function displayCircleComments(index) {
    const circleCommentsList = document.getElementById(`circle-comments-list-${index}`);
    circleCommentsList.innerHTML = '';
    circles[index].comments.forEach((comment, commentIndex) => {
        circleCommentsList.innerHTML += `
            <p>
                <strong>${comment.user}:</strong> ${comment.content}
                <button onclick="toggleLikeCircleComment(${index}, ${commentIndex})">👍 (${formatLikes(comment.likes)})</button>
                <button class="delete-button" onclick="deleteCircleComment(${index}, ${commentIndex})" ${comment.user !== currentUser ? 'style="display: none;"' : ''}>Delete</button>
            </p>
        `;
    });
}

function toggleLikeCircleComment(circleIndex, commentIndex) {
    const comment = circles[circleIndex].comments[commentIndex];
    const userLiked = comment.likedBy.includes(currentUser);
    
    if (userLiked) {
        comment.likes--;
        comment.likedBy = comment.likedBy.filter(user => user !== currentUser);
    } else {
        comment.likes++;
        comment.likedBy.push(currentUser);
    }
    
    displayCircleComments(circleIndex);
    updateLinkScore();
}

function deleteCircle(index) {
    if (circles[index].user === currentUser) {
        circles.splice(index, 1);
        displayCircles();
        updateLinkScore();
    }
}

function deleteCircleComment(circleIndex, commentIndex) {
    if (circles[circleIndex].comments[commentIndex].user === currentUser) {
        circles[circleIndex].comments.splice(commentIndex, 1);
        displayCircleComments(circleIndex);
        updateLinkScore();
    }
}

function updateProfile() {
    document.getElementById('linkscore').innerText = formatLinkScore(linkscore);
}

function updateLinkScore() {
    let totalLikes = 0;
    let totalComments = 0;

    // Calculate total likes from posts
    posts.forEach(post => {
        totalLikes += post.likes;
        totalComments += post.comments.length;
    });

    // Calculate total likes from circles
    circles.forEach(circle => {
        totalLikes += circle.likes;
        totalComments += circle.comments.length;
    });

    // Calculate the LinkScore
    linkscore = totalLikes + totalComments * 10;
    updateProfile();
}

function formatLinkScore(score) {
    if (score >= 1000000) {
        return `${(score / 1000000).toFixed(2)}M`;
    } else if (score >= 1000) {
        return `${(score / 1000).toFixed(2)}K`;
    } else {
        return score.toString();
    }
}

function formatLikes(likes) {
    if (likes >= 1000000) {
        return `${(likes / 1000000).toFixed(2)}M`;
    } else if (likes >= 1000) {
        return `${(likes / 1000).toFixed(2)}K`;
    } else {
        return likes.toString();
    }
}

function isUsernameAvailable(username) {
    // Implement username availability check
    return true;
}

function isValidLogin(username, password) {
    // Implement login validation
    return true;
}
