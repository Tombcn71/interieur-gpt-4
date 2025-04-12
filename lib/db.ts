import { neon } from "@neondatabase/serverless"

// Check if DATABASE_URL is available and valid
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.startsWith("postgres://")) {
  console.error("Invalid or missing DATABASE_URL environment variable. Please set a valid Neon database URL.")
}

// Create a SQL client with proper error handling
export const sql = neon(process.env.DATABASE_URL || "")

// Wrap database functions with error handling
export async function getUserById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [user] = await sql`
      SELECT * FROM users WHERE id = ${id}
    `
    return user
  } catch (error) {
    console.error("Error getting user by ID:", error)
    return null
  }
}

export async function getUserByEmail(email: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [user] = await sql`
      SELECT * FROM users WHERE email = ${email}
    `
    return user
  } catch (error) {
    console.error("Error getting user by email:", error)
    return null
  }
}

export async function createUser(email: string, name: string, image?: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [user] = await sql`
      INSERT INTO users (email, name, image)
      VALUES (${email}, ${name}, ${image})
      RETURNING *
    `
    return user
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export async function updateUserCredits(userId: string, credits: number) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [user] = await sql`
      UPDATE users
      SET credits = credits + ${credits}
      WHERE id = ${userId}
      RETURNING *
    `
    return user
  } catch (error) {
    console.error("Error updating user credits:", error)
    return null
  }
}

export async function createDesign(
  userId: string,
  roomType: string,
  style: string,
  originalImageUrl: string,
  prompt: string,
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [design] = await sql`
      INSERT INTO designs (user_id, room_type, style, original_image_url, prompt)
      VALUES (${userId}, ${roomType}, ${style}, ${originalImageUrl}, ${prompt})
      RETURNING *
    `
    return design
  } catch (error) {
    console.error("Error creating design:", error)
    throw error
  }
}

export async function updateDesignResult(designId: string, resultImageUrl: string, status: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [design] = await sql`
      UPDATE designs
      SET result_image_url = ${resultImageUrl}, status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${designId}
      RETURNING *
    `
    return design
  } catch (error) {
    console.error("Error updating design result:", error)
    return null
  }
}

export async function getUserDesigns(userId: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const designs = await sql`
      SELECT * FROM designs
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `
    return designs
  } catch (error) {
    console.error("Error getting user designs:", error)
    return []
  }
}

export async function getDesignById(id: string) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [design] = await sql`
      SELECT * FROM designs WHERE id = ${id}
    `
    return design
  } catch (error) {
    console.error("Error getting design by ID:", error)
    return null
  }
}

export async function createPayment(
  userId: string,
  stripePaymentId: string,
  amount: number,
  credits: number,
  status: string,
) {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not configured")
    }

    const [payment] = await sql`
      INSERT INTO payments (user_id, stripe_payment_id, amount, credits, status)
      VALUES (${userId}, ${stripePaymentId}, ${amount}, ${credits}, ${status})
      RETURNING *
    `
    return payment
  } catch (error) {
    console.error("Error creating payment:", error)
    throw error
  }
}
