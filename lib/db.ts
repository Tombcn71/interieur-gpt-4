import { neon } from "@neondatabase/serverless";
import type { Design } from "@/types/design";

// Check if DATABASE_URL is available and valid
if (
  !process.env.DATABASE_URL ||
  !process.env.DATABASE_URL.startsWith("postgres://")
) {
  console.error(
    "Invalid or missing DATABASE_URL environment variable. Please set a valid Neon database URL."
  );
}

// Create a SQL client with proper error handling
export const sql = neon(process.env.DATABASE_URL || "");

// Wrap database functions with error handling
export async function getUserById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `;
    return user;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;
    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    return null;
  }
}

// Update the function signature to explicitly handle null values
export async function createUser(
  email: string,
  name: string,
  image?: string | undefined
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    // Ensure image is undefined if null
    const safeImage = image === null ? undefined : image;

    const [user] = await sql`
      INSERT INTO users (email, name, image)
      VALUES (${email}, ${name}, ${safeImage})
      RETURNING *
    `;
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update the updateUserCredits function to be more robust
export async function updateUserCredits(userId: string, credits: number) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    console.log(
      `Updating credits for user ${userId}: adding ${credits} credits`
    );

    // If we're deducting credits, make sure we don't go below zero
    if (credits < 0) {
      // First get the current credits
      const user = await getUserById(userId);
      if (!user) {
        throw new Error(`User not found: ${userId}`);
      }

      console.log(`User ${userId} current credits: ${user.credits}`);

      // If the user doesn't have enough credits, don't update
      if (user.credits + credits < 0) {
        console.error(
          `Attempted to reduce credits below zero for user ${userId}. Current: ${user.credits}, Change: ${credits}`
        );
        // Return the current user without changes
        return user;
      }
    }

    // Proceed with the update, ensuring we never go below zero
    const [user] = await sql`
      UPDATE users
      SET credits = GREATEST(0, credits + ${credits})
      WHERE id = ${userId}
      RETURNING *
    `;

    console.log(
      `Credits updated successfully for user ${userId}. New credits:`,
      user ? user.credits : "unknown"
    );
    return user;
  } catch (error) {
    console.error("Error updating user credits:", error);
    throw error; // Re-throw to ensure the webhook handler catches it
  }
}

// Add a function to get the current user credits
export async function getUserCredits(userId: string): Promise<number> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const [result] = await sql`
      SELECT credits FROM users WHERE id = ${userId}
    `;
    return result ? result.credits : 0;
  } catch (error) {
    console.error("Error getting user credits:", error);
    return 0;
  }
}

// Add a function to reset credits to zero if they're negative
export async function fixNegativeCredits(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    console.log(`Attempting to fix negative credits for user ${userId}`);

    // First check if the user has negative credits
    const user = await getUserById(userId);

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    console.log(`User ${userId} current credits: ${user.credits}`);

    if (user.credits < 0) {
      // Reset credits to 1 if they're negative
      const [updatedUser] = await sql`
        UPDATE users
        SET credits = 1
        WHERE id = ${userId} AND credits < 0
        RETURNING *
      `;
      console.log(
        `Updated user ${userId} credits from ${user.credits} to ${updatedUser.credits}`
      );
      return updatedUser;
    } else {
      console.log(
        `User ${userId} does not have negative credits, no update needed`
      );
      return user;
    }
  } catch (error) {
    console.error("Error fixing negative credits:", error);
    throw error;
  }
}

export async function createDesign(
  userId: string,
  roomType: string,
  style: string,
  originalImageUrl: string,
  prompt: string
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    // Ensure userId is not null or undefined
    if (!userId) {
      throw new Error("User ID is required for creating a design");
    }

    // Convert userId to a number if it's a string
    const userIdNum = Number.parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      throw new Error(`Invalid user ID: ${userId}`);
    }

    console.log("Creating design with params:", {
      userId: userIdNum,
      roomType,
      style,
      originalImageUrl,
    });

    const [design] = await sql`
      INSERT INTO designs (user_id, room_type, style, original_image_url, prompt)
      VALUES (${userIdNum}, ${roomType}, ${style}, ${originalImageUrl}, ${prompt})
      RETURNING *
    `;
    return design as Design;
  } catch (error) {
    console.error("Error creating design:", error);
    throw error;
  }
}

export async function updateDesignResult(
  designId: string,
  resultImageUrl: string,
  status: string
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const [design] = await sql`
      UPDATE designs
      SET result_image_url = ${resultImageUrl}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${designId}
      RETURNING *
    `;
    return design as Design;
  } catch (error) {
    console.error("Error updating design result:", error);
    return null;
  }
}

export async function getUserDesigns(userId: string): Promise<Design[]> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    // Convert userId to a number if it's a string
    const userIdNum = Number.parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      throw new Error(`Invalid user ID: ${userId}`);
    }

    const designs = await sql`
      SELECT * FROM designs
      WHERE user_id = ${userIdNum}
      ORDER BY created_at DESC
    `;
    return designs as Design[];
  } catch (error) {
    console.error("Error getting user designs:", error);
    return [];
  }
}

export async function getDesignById(id: string): Promise<Design | null> {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    const [design] = await sql`
      SELECT * FROM designs WHERE id = ${id}
    `;
    return (design as Design) || null;
  } catch (error) {
    console.error("Error getting design by ID:", error);
    return null;
  }
}

export async function createPayment(
  userId: string,
  stripePaymentId: string,
  amount: number,
  credits: number,
  status: string
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured");
    }

    // Convert userId to a number if it's a string
    const userIdNum = Number.parseInt(userId, 10);

    if (isNaN(userIdNum)) {
      throw new Error(`Invalid user ID: ${userId}`);
    }

    const [payment] = await sql`
      INSERT INTO payments (user_id, stripe_payment_id, amount, credits, status)
      VALUES (${userIdNum}, ${stripePaymentId}, ${amount}, ${credits}, ${status})
      RETURNING *
    `;
    return payment;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}
