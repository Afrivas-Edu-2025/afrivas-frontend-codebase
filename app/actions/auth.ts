"use server"

import { revalidatePath } from "next/cache"

// Define types for our API responses
type ApiResponse = {
  success: boolean
  message: string
  data?: any
}

// Define types for our form data
export type SignupFormData = {
  fullname: string
  email: string
  sex: string
  dob: string
  role: string
  username: string
  password: string
  year?: string
  semester?: string
  faculty?: string
  department?: string
}

export async function registerUser(formData: SignupFormData): Promise<ApiResponse> {
  try {
    // Split fullname into firstName and lastName
    const nameParts = formData.fullname.split(" ")
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : ""

    // Format date to YYYY-MM-DD if needed
    const dob = formData.dob

    // Map gender values
    const gender = formData.sex.toUpperCase()

    // Common institution ID
    const institutionId = "550e8400-e29b-41d4-a716-446655440000"

    // Prepare request options based on role
    let url = ""
    let requestData = {}

    if (formData.role.toLowerCase() === "student") {
      url = "http://localhost:3303/api/v1/auth/signup"
      requestData = {
        email: formData.email,
        password: formData.password,
        firstName,
        lastName,
        gender, 
        dob,
        role: "STUDENT",
        institutionId,
      }
    } else if (formData.role.toLowerCase() === "lecturer") {
      url = "http://localhost:5000/api/v1/lecturer/signup"
      requestData = {
        firstName,
        lastName,
        email: formData.email,
        password: formData.password,
        gender,
        dob,
        department: formData.department,
        institutionId,
      }
    } else {
      return {
        success: false,
        message: "Invalid role selected",
      }
    }

    // Make the API request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })

    // Parse the response
    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Registration failed",
      }
    }

    // Revalidate the path to refresh server-side data
    revalidatePath("/")

    return {
      success: true,
      message: "Registration successful",
      data: result,
    }
  } catch (error) {
    console.error("Registration error:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unknown error occurred",
    }
  }
}
