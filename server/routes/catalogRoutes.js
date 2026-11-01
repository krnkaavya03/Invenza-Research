const express = require('express');
const router = express.Router();

const {
    generateCatalog,
    getCatalogDraft,
    updateCatalogDraft,
    approveCatalogDraft
} = require('../controllers/catalogController');

const { protect } = require('../middleware/auth');

router.post('/generate', protect, generateCatalog);
router.get('/draft/:id', protect, getCatalogDraft);
router.put('/draft/:id', protect, updateCatalogDraft);
router.post('/draft/:id/approve', protect, approveCatalogDraft);

module.exports = router;
