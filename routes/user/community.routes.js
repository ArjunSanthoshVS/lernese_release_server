const express = require('express');
const router = express.Router();
const communityController = require('../../controllers/user/communityController');
const { verifyToken } = require('../../middleware/auth');
const multer = require('../../middleware/multer');
const audioMulter = require('../../middleware/audioMulter');

// Forum routes
router.get('/forum/posts', verifyToken, communityController.getAllForumPosts);
router.post('/forum/posts', verifyToken, multer.array('attachments'), communityController.createForumPost);
router.get('/forum/posts/:id', verifyToken, communityController.getForumPostById);
router.post('/forum/posts/:id/like', verifyToken, communityController.toggleLikeForumPost);

// Use the enhanced audioMulter middleware for comment routes
router.post('/forum/posts/:id/comment', 
    verifyToken,
    (req, res, next) => {
        console.log('=== Starting comment upload ===');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Raw body:', req.body);
        
        // Log the raw request to see what's coming in
        let data = '';
        req.on('data', chunk => {
            data += chunk;
        });
        req.on('end', () => {
            console.log('Raw request data:', data.substring(0, 1000)); // Log first 1000 chars to avoid huge logs
        });
        
        next();
    },
    audioMulter,
    communityController.addComment
);

router.post('/forum/posts/:id/comments/:commentId/reply',
    verifyToken,
    audioMulter,
    communityController.addReply
);

router.post('/forum/posts/:id/comments/:commentId/like', verifyToken, communityController.toggleCommentLike);
router.post('/forum/posts/:id/comments/:commentId/replies/:replyId/like', verifyToken, communityController.toggleReplyLike);
router.post('/forum/posts/:id/comments/:commentId/reactions', verifyToken, communityController.toggleReaction);
router.get('/forum/category/:category', verifyToken, communityController.getForumPostsByCategory);

// Study group routes
router.get('/studygroups', verifyToken, communityController.getAllStudyGroups);
router.get('/studygroups/:id', verifyToken, communityController.getStudyGroupDetails);
router.post('/studygroups/:id/join', verifyToken, communityController.joinStudyGroup);
router.post('/studygroups/:id/leave', verifyToken, communityController.leaveStudyGroup);
router.get('/mystudygroups', verifyToken, communityController.getMyStudyGroups);
router.get('/studygroups/:id/resources', verifyToken, communityController.getStudyGroupResources);
router.get('/studygroups/:id/messages', verifyToken, communityController.getStudyGroupMessages);
router.post('/studygroups/:id/messages', verifyToken, communityController.sendStudyGroupMessage);

module.exports = router; 