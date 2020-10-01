/**
 * External dependencies
 */
import * as mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

/**
 * Create the notification schema
 */
const notification: mongoose.Schema = new mongoose.Schema(
    {
        topic: {
            type: String,
            required: true,
        },
        key: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: false,
        },
        recipient: {
            type: String,
            required: false,
        },
        sender: {
            type: String,
            required: false,
        },
        read: {
            type: Boolean,
            required: false,
            default: false,
        },
        properties: {}
    },
    {
        timestamps: {
            createdAt: 'ctime',
            updatedAt: 'mtime',
        }
    }
);

notification.plugin(mongoosePaginate);

/**
 * Export the model
 */
export default mongoose.model('Notification', notification);
