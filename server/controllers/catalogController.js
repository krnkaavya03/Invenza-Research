const axios = require('axios');
const CatalogDraft = require('../models/CatalogDraft');

const AI_URL = process.env.AI_SERVICE_URL || 'http://127.0.0.1:8000';

exports.generateCatalog = async (req, res) => {
    try {
        const {
            productName,
            category,
            brand,
            keySpecs,
            language,
            rawInput,
            sourceType,
            imageBase64
        } = req.body;

        if (!productName && !rawInput && !imageBase64) {
            return res.status(400).json({
                message: 'Product input is required'
            });
        }

        const aiResponse = await axios.post(
            `${AI_URL}/api/catalog/generate`,
            {
                product_name: productName || '',
                category: category || '',
                brand: brand || '',
                key_specs: keySpecs || [],
                language: language || 'English',
                raw_input: rawInput || '',
                source_type: sourceType || 'text',
                image_base64: imageBase64 || ''
            },
            { timeout: 60000 }
        );

        const data = aiResponse.data || {};

        const draft = await CatalogDraft.create({
            userId: req.user._id,
            sourceType: sourceType || 'text',
            sourceLanguage: language || 'English',
            rawInput: rawInput || '',
            imageData: imageBase64 || '',
            input: {
                productName: productName || '',
                category: category || '',
                brand: brand || '',
                keySpecs: keySpecs || []
            },
            catalog: data.catalog || {},
            status: 'review',
            aiSource: data.source || 'unavailable',
            requiresReview: data.requiresReview !== false
        });

        res.status(201).json({
            draftId: draft._id,
            source: data.source || 'unavailable',
            requiresReview: data.requiresReview !== false,
            catalog: draft.catalog,
            status: draft.status,
            message: data.message || 'Catalog draft created for review.'
        });
    } catch (error) {
        console.error('Invenza catalog generation error:', error.message);

        res.status(502).json({
            source: 'unavailable',
            requiresReview: true,
            message: 'AI Catalog service is unavailable.',
            catalog: null
        });
    }
};

exports.getCatalogDraft = async (req, res) => {
    try {
        const draft = await CatalogDraft.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                message: 'Catalog draft not found'
            });
        }

        res.json(draft);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve catalog draft'
        });
    }
};

exports.updateCatalogDraft = async (req, res) => {
    try {
        const draft = await CatalogDraft.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                message: 'Catalog draft not found'
            });
        }

        if (req.body.catalog) {
            draft.catalog = {
                ...draft.catalog.toObject(),
                ...req.body.catalog
            };
        }

        if (req.body.input) {
            draft.input = {
                ...draft.input.toObject(),
                ...req.body.input
            };
        }

        if (req.body.status && ['draft', 'review'].includes(req.body.status)) {
            draft.status = req.body.status;
        }

        draft.requiresReview = true;

        await draft.save();

        res.json(draft);
    } catch (error) {
        res.status(500).json({
            message: 'Failed to update catalog draft'
        });
    }
};

exports.approveCatalogDraft = async (req, res) => {
    try {
        const draft = await CatalogDraft.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!draft) {
            return res.status(404).json({
                message: 'Catalog draft not found'
            });
        }

        draft.status = 'approved';
        draft.requiresReview = false;

        await draft.save();

        res.json({
            message: 'Catalog approved successfully',
            draft
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to approve catalog draft'
        });
    }
};
