pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract SasthaTwitter{
    uint public postCount;
    mapping(uint => Post) public posts;

    struct Post{
        uint id;
        string content;
        uint timestamp;
        address payable owner;
        uint tipAmount;
    }
    
    // create a new post
    function createPost(string memory _content) public {
        require(bytes(_content).length > 0, "Post content is requried!");

        postCount++;
        posts[postCount] = Post(postCount, _content, block.timestamp, msg.sender, 0);
    }

    // tip post with some ethers
    function tipPost(uint _id) public payable{
        require(msg.value>0, "Tip amount should not be 0!");
        require(_id>0 && _id<=postCount, "Invalid Tip ID!");

        Post storage _post = posts[_id];

        address payable _owner = _post.owner;

        require(_owner != msg.sender, "Post owner cannot tip to his own post!");

        address(_owner).transfer(msg.value);

        _post.tipAmount+=(msg.value);

        posts[_id]=_post;
    }

    // get all posts
    function getAllPosts() public view returns(Post[] memory){
        Post[] memory _posts = new Post[](postCount);

        for(uint i=1; i<=postCount; i++){
            _posts[i-1]=posts[i];
        }

        return _posts;
    }
}