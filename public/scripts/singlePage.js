window.onload = function () {
    // bookmarks

    let bookmarks = document.getElementsByClassName('bookmark');
    [...bookmarks].forEach((bookmark) => {
        bookmark.style.cursor = 'pointer';
        bookmark.addEventListener('click', function (e) {
            let target = e.target.parentElement;

            let headers = new Headers();
            console.log(target.dataset.post);
            headers.append('Accept', 'Application/JSON');

            let req = new Request(`/api/bookmarks/${target.dataset.post}`, {
                method: 'GET',
                headers,
                mode: 'cors',
            });

            fetch(req)
                .then((res) => res.json())
                .then((data) => {
                    if (data.bookmark) {
                        target.innerHTML = '<i class="fas fa-bookmark"> </i>';
                    } else {
                        target.innerHTML = '<i class="far fa-bookmark"> </i>';
                    }
                })
                .catch((e) => {
                    console.error(e.response.data);
                    alert(e.response.data.error);
                });
        });
    });

    // Like & Dislike

    const likeBtn = document.getElementById('likeBtn');
    const dislikeBtn = document.getElementById('disLikeBtn');

    likeBtn.addEventListener('click', function (e) {
        let postId = likeBtn.dataset.post;
        reqLikeDislike('likes', postId)
            .then((res) => res.json())
            .then((data) => {
                let likeText = data.liked ? 'Liked ' : 'Like ';
                likeText = likeText + `( ${data.totalLikes} )`;
                let dislikeText = `Dislike ( ${data.totalDisLikes} )`;

                likeBtn.innerHTML = likeText;
                dislikeBtn.innerHTML = dislikeText;
            })
            .catch((e) => {
                console.log(e);
                alert(e.response.data.error);
            });
    });

    dislikeBtn.addEventListener('click', function (e) {
        let postId = dislikeBtn.dataset.post;
        reqLikeDislike('dislikes', postId)
            .then((res) => res.json())
            .then((data) => {
                let dislikeText = data.disliked ? 'Disliked' : 'Dislike';
                dislikeText = dislikeText + ` ( ${data.totalDisLikes} )`;
                let likeText = `Like ( ${data.totalLikes} )`;

                dislikeBtn.innerHTML = dislikeText;
                likeBtn.innerHTML = likeText;
            })
            .catch((e) => {
                console.log(e);
                alert(e.response.data.error);
            });
    });

    function reqLikeDislike(type, postId) {
        let headers = new Headers();
        headers.append('Accept', 'Application.JSON');
        headers.append('Content-Type', 'Application/JSON');

        let req = new Request(`/api/${type}/${postId}`, {
            method: 'GET',
            headers,
            mode: 'cors',
        });

        return fetch(req);
    }

    // comment

    const comment = document.getElementById('comment');
    const commentHolder = document.getElementById('comment-holder');

    const commentFunction = () => {
        comment.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                if (e.target.value) {
                    const postId = comment.dataset.post;
                    const data = {
                        body: e.target.value,
                    };

                    generateRequest(`/api/comments/${postId}`, 'POST', data)
                        .then((res) => res.json())
                        .then((data) => {
                            const commentElement = createComment(data);
                            commentHolder.insertBefore(
                                commentElement,
                                commentHolder.children[0]
                            );
                            e.target.value = '';
                        })
                        .catch((e) => console.log(e));
                } else {
                    alert('Please enter a valid comment');
                }
            }
        });
    };

    if (comment) {
        commentFunction();
    }

    commentHolder.addEventListener('keypress', function (e) {
        if (commentHolder.hasChildNodes(e.target)) {
            if (e.key === 'Enter') {
                const commentId = e.target.dataset.comment;
                const value = e.target.value;

                if (value) {
                    const data = {
                        body: value,
                    };

                    generateRequest(
                        `/api/comments/replies/${commentId}`,
                        'POST',
                        data
                    )
                        .then((res) => res.json())
                        .then((data) => {
                            const replyElement = createReplyElement(data);
                            const parent = e.target.parentElement.parentElement; // selecting replies div
                            parent.insertBefore(
                                replyElement,
                                parent.lastElementChild
                            ); // insering before the input tag
                            e.target.value = '';
                        })
                        .catch((e) => console.log(e));
                }
            }
        }
    });

    function generateRequest(url, method, body) {
        const headers = new Headers();
        headers.append('Accept', 'Application/JSON');
        headers.append('Content-Type', 'Application/JSON');

        const req = new Request(url, {
            method,
            headers,
            body: JSON.stringify(body),
            mode: 'cors',
        });

        return fetch(req);
    }
};

function createComment(comment) {
    const innerHTML = `
        <img src="${comment.user.profilePics}"  alt="Profile Pics" class="rounded-circle mx-3 my-3" style="width: 40px;">
        <div class="media-body my-3">
            <p>${comment.body}</p>
        
            <div class="my-3">
                <input type="text" name="reply" placeholder="Press enter to reply" data-comment="${comment._id}" class="form-control">
            </div>
        </div>
        `;
    const div = document.createElement('div');
    div.innerHTML = innerHTML;
    div.className = 'media border';
    return div;
}

function createReplyElement(data) {
    const innerHTML = `
        <img src="${data.profilePics}" alt="Profile Pics" class="align-self-start mr-3 rounded-circle" style="width: 40px;">
        <div class="media-body">
            <p>${data.body}</p>
        </div>
        `;

    const div = document.createElement('div');
    div.className = 'media mt-3';
    div.innerHTML = innerHTML;
    return div;
}
