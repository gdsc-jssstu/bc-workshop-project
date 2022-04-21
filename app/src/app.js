import Identicon from "identicon.js";

/*** VARIABLES */
var CONTRACT;
var ACCOUNT;

function createPost(content) {
  try {
    // console.log(content);
    if (!content) {
      alert("Empty content is not allowed!");
      return;
    }
    CONTRACT.methods
      .createPost(content)
      .send({ from: ACCOUNT })
      .on("receipt", (_) => {
        window.location.reload();
      });
  } catch (error) {
    console.log(error);
    alert("Couldn't create post, Try again!");
  }
}

async function getAllPosts(_CONTRACT, _ACCOUNT) {
  CONTRACT = _CONTRACT;
  ACCOUNT = _ACCOUNT;

  try {
    const _posts = await CONTRACT.methods.getAllPosts().call();
    // console.log(_posts);
    _posts.reverse();
    // _posts.sort((A, B) => B.tipAmount - A.tipAmount);

    const display_posts = document.getElementById("display_posts");

    _posts.forEach((post) => {
      const parentDiv = document.createElement("div");
      parentDiv.className = "card shadow rounded mx-2 my-3";
      parentDiv.innerHTML = `
		<div class="card-header d-flex align-items-center">
		  <img src=${`data:image/png;base64,${new Identicon(
        post.owner,
        30
      ).toString()}`} alt="profile" width="30px" height="30px" class="rounded-circle" style="margin-right:10px;" />
		  <span>${post.owner}</span>
		</div>
		<div class="card-body">
		  <p>${post.content}</p>
		  <span style="font-size:0.8rem;">
				<em>${new Date(post.timestamp * 1000).toLocaleString()}</em>
		  </span>
		</div>
		<div class="card-footer d-flex justify-content-between">
		  <div>
			<p>Total Tips: ${post.tipAmount / 10 ** 18} ETH</p>
		  </div>
		  <div>
			<button class="btn btn-sm btn-info" id="post-id-${post.id}">Tip 1 ETH</button>
		  </div>
		</div>
			`;
      display_posts.appendChild(parentDiv);

      document
        .getElementById(`post-id-${post.id}`)
        .addEventListener("click", (e) => {
          e.preventDefault();
          tipPost(post.id);
        });
    });
  } catch (error) {
    console.log(error);
    alert("Couldn't retrieve all posts, Try again!");
  }
}

function tipPost(id) {
  try {
    // console.log(id);
    if (!id) {
      alert("post id is required!");
      return;
    }
    CONTRACT.methods
      .tipPost(id)
      .send({ from: ACCOUNT, value: window.web3.utils.toWei("1") })
      .on("receipt", (_) => {
        window.location.reload();
      });
  } catch (error) {
    console.log(error);
    alert("Couldn't tip post, Try again!");
  }
}

export { createPost, getAllPosts };
