"use server";
import OpenAI from "openai";
import prisma from "./db";
import { revalidatePath } from "next/cache";
//https://platform.openai.com/docs/api-reference/chat/create
//https://platform.openai.com/docs/api-reference/streaming
//below set up is from API doc

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
// By providing the API key through this configuration object,
// you ensure that the OpenAI client is properly authenticated and authorized
// to make requests to the OpenAI API, allowing your application to interact
// with the OpenAI services as intended.

export const generateChatResponse = async (chatMessages) => {
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "you are a helpful assistant" },
        ...chatMessages, // this code is to also record the previous content: message from user.
        // so chatGPT knows the consequential answer regarding the previous question.
        // therefore the chat will flow like a nature conversation rather than having to start
        // from zero on the same topic on each question.
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
      max_tokens: 100,
    });
    // console.log(response.choices[0].message);
    // console.log(response);
    return {
      message: response.choices[0].message,
      tokens: response.usage.total_tokens,
    };
  } catch (error) {
    return null;
  }
};

export const generateTourResponse = async ({ city, country }) => {
  const query = `Find a exact ${city} in this exact ${country}.
If ${city} and ${country} exist, create a list of things families can do in this ${city},${country}. 
Once you have a list, create a one-day tour. Response should be  in the following JSON format: 
{
  "tour": {
    "city": "${city}",
    "country": "${country}",
    "title": "title of the tour",
    "description": "short description of the city and tour",
    "stops": ["short paragraph on the stop 1 ", "short paragraph on the stop 2","short paragraph on the stop 3"]
  }
}
"stops" property should include only three stops.
If you can't find info on exact ${city}, or ${city} does not exist, or it's population is less than 1, or it is not located in the following ${country},   return { "tour": null }, with no additional characters.`;
  try {
    const response = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "you are a tour guide" },
        { role: "user", content: query }, // this code is to also record the previous content: message from user.
        // so chatGPT knows the consequential answer regarding the previous question.
        // therefore the chat will flow like a nature conversation rather than having to start
        // from zero on the same topic on each question.
      ],
      model: "gpt-3.5-turbo",
      temperature: 0,
    });

    const tourData = JSON.parse(response.choices[0].message.content);

    if (!tourData.tour) {
      return null;
    }
    return { tour: tourData.tour, tokens: response.usage.total_tokens };
  } catch (error) {
    return null;
  }
};

// The reason of using Prisma to save the data in the database is because if user types in
// the same city+country to search again, the data can be retrieved from the database rather
// than going through refetching from OpenAI again. It's faster, also don't consume any token.

export const getExistingTour = async ({ city, country }) => {
  return prisma.tour.findUnique({ where: { city_country: { city, country } } });
  //In this context, city_country seems to be a composite key that combines both the city and country fields into a single key for uniqueness.
  //By using city_country as a composite key, you ensure that each combination of city and country is unique within the database table.
};

export const createNewTour = async (tour) => {
  return prisma.tour.create({ data: tour });
};

export const getAllTours = async (searchTerm) => {
  if (!searchTerm) {
    const tours = await prisma.tour.findMany({ orderBy: { city: "asc" } });
    return tours;
  }
  const tours = await prisma.tour.findMany({
    where: {
      OR: [
        // OR is for either city or country
        {
          city: {
            contains: searchTerm,
          },
        },
        {
          country: {
            contains: searchTerm,
          },
        },
      ],
    },
    orderBy: {
      city: "asc",
    },
  });
  return tours;
};

export const getSingleTour = async (id) => {
  return prisma.tour.findUnique({ where: { id } });
};

export const generateTourImage = async ({ city, country }) => {
  try {
    const tourImage = await openai.images.generate({
      prompt: `a panoramic view of the ${city} ${country}`,
      n: 1,
      size: "512x512",
    });
    return tourImage?.data[0]?.url;
  } catch (error) {
    return null;
  }
};

export const fetchUserTokensById = async (clerkId) => {
  const result = await prisma.token.findUnique({
    where: {
      clerkId,
    },
  });

  return result?.tokens;
};

export const generateUserTokensForId = async (clerkId) => {
  const result = await prisma.token.create({
    data: {
      clerkId,
    },
  });
  return result?.tokens;
};

export const fetchOrGenerateTokens = async (clerkId) => {
  const result = await fetchUserTokensById(clerkId);
  if (result) {
    return result;
  }
  return await generateUserTokensForId(clerkId);
};

export const subtractTokens = async (clerkId, tokens) => {
  const result = await prisma.token.update({
    where: {
      clerkId,
    },
    data: {
      tokens: {
        decrement: tokens,
      },
    },
  });
  revalidatePath("/profile");
  // Return the new token value
  return result.tokens;
};
