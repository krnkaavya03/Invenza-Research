const mongoose = require('mongoose');

const catalogDraftSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        sourceType: {
            type: String,
            enum: ['text', 'voice', 'image', 'multimodal'],
            default: 'text'
        },

        sourceLanguage: {
            type: String,
            default: 'English'
        },

        rawInput: {
            type: String,
            default: ''
        },

        imageData: {
            type: String,
            default: ''
        },

        input: {
            productName: { type: String, default: '' },
            category: { type: String, default: '' },
            brand: { type: String, default: '' },
            keySpecs: {
                type: [String],
                default: []
            }
        },

        catalog: {
            title: { type: String, default: '' },
            description: { type: String, default: '' },
            category: { type: String, default: '' },
            brand: { type: String, default: '' },
            keySpecs: {
                type: [String],
                default: []
            },
            seoTags: {
                type: [String],
                default: []
            },
            suggestedPriceRange: {
                min: { type: Number, default: null },
                max: { type: Number, default: null },
                currency: { type: String, default: 'INR' }
            },
            missingFields: {
                type: [String],
                default: []
            }
        },

        status: {
            type: String,
            enum: ['draft', 'review', 'approved'],
            default: 'draft'
        },

        aiSource: {
            type: String,
            default: 'unavailable'
        },

        requiresReview: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.models.CatalogDraft ||
    mongoose.model('CatalogDraft', catalogDraftSchema);
