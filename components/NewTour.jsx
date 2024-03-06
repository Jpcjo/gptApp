"use client";
import React from "react";
import TourInfo from "./TourInfo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getExistingTour,
  generateTourResponse,
  createNewTour,
  subtractTokens,
  fetchUserTokensById,
} from "@/utils/action";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();
  //So, when you use useQueryClient, you're essentially saying, "Hey, I want to interact with
  //the tool that keeps track of my fetched data." This allows you to perform actions like
  //refreshing data, invalidating queries (which means telling the manager to forget the data
  //and refetch it when needed), and more.
  const { userId } = useAuth();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destination) => {
      const existingTour = await getExistingTour(destination);
      if (existingTour) return existingTour;

      const currentTokens = await fetchUserTokensById(userId);

      if (currentTokens < 300) {
        toast.error("Token balance too low....");
        return;
      }
      const newTour = await generateTourResponse(destination);
      if (!newTour) {
        toast.error("No matching city found...");
        return null;
      }
      const response = await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`${newTokens} tokens remaining...`);
      return newTour.tour;
    },
  });
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    //This line creates a new FormData object named formData from the current
    //form element (e.currentTarget), which is the form that triggered the
    //submit event.
    //   console.log(formData);
    //   FormData <entries>{ city → "london", country → "england" }

    const destination = Object.fromEntries(formData.entries());
    //This line converts the FormData object formData into a plain JavaScript
    //object destination. We use formData.entries() to get an iterator over all
    //key/value pairs contained in the FormData object. Then,
    //Object.fromEntries() converts these key/value pairs into an object where
    //each key corresponds to a form field name and each value corresponds to
    //the form field value.
    //   console.log(destination);
    //   Object { city: "london", country: "england" }
    mutate(destination);
  };
  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      <h2 className=" mb-4">Select your dream destination</h2>
      <div className="join w-full">
        <input
          type="text"
          className="input input-bordered join-item w-full"
          placeholder="city"
          name="city"
          required
        />
        <input
          type="text"
          className="input input-bordered join-item w-full"
          placeholder="country"
          name="country"
          required
        />
        <button className="btn btn-primary join-item" type="submit">
          generate tour
        </button>
      </div>
      <div className="mt-16">
        <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
      </div>
    </form>
  );
};

export default NewTour;
