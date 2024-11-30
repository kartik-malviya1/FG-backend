import { Request, Response } from 'express';
import User from '../models/user.model';

export const handleClerkWebhook = async (req: Request, res: Response) => {
  const { type, data } = req.body;

  try {
    switch (type) {
      case 'user.created':
      case 'user.updated':
        await User.findOneAndUpdate(
          { clerkId: data.id },
          {
            clerkId: data.id,
            name: `${data.first_name} ${data.last_name}`,
            email: data.email_addresses[0].email_address
          },
          { upsert: true, new: true }
        );
        break;

      case 'user.deleted':
        await User.findOneAndDelete({ clerkId: data.id });
        break;

      default:
        console.log(`Unhandled webhook type: ${type}`);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Clerk webhook error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error processing webhook' 
    });
  }
}; 