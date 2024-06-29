"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { pb } from "@/lib/pbClient";
import { useUserStore } from "@/lib/stores/user";
import { FeedItem } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  description: z.string().min(1).max(100),
  file: z.instanceof(FileList),
  // file: z.unknown().transform((value) => {
  //   return value as FileList;
  // }),
  location: z.string().default("kalani"),
  type: z.string(),
  name: z.string(),
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [preview, setPreview] = useState("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob>();

  const user = useUserStore((state) => state.user);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("picUrl", selectedFile);
      formData.append("user_id", user.id);
      formData.append("username", user.name);
      formData.append("description", data.description);
      formData.append("location", "kalani");

      console.log(Array.from(formData));

      const createdRecordPosts = await pb.collection("posts").create(formData);
      const createdRecordTrees = await pb.collection("trees").create({
        location: "kalani",
        user_id: user.id,
        type: data.type,
        name: data.name,
      });

      const newFormData = new FormData();
      newFormData.append("picUrl", selectedFile);
      newFormData.append("tree_id", createdRecordTrees.id);
      newFormData.append("upvotes", "0");
      const createdRecordTreeImages = await pb
        .collection("tree_images")
        .create(newFormData);
    }
  };

  const fileRef = form.register("file");

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4 pt-10">
        <div className="relative size-64">
          <Image
            src={preview}
            alt="its a pic"
            fill
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full p-10 flex flex-col gap-10"
          >
            <div className="flex flex-col gap-5 w-full">
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Upload Picture</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          {...fileRef}
                          onChange={(e) => {
                            if (e.target.files) {
                              const previewUrl = URL.createObjectURL(
                                e.target.files[0]
                              );
                              setSelectedFile(e.target.files[0]);
                              setPreview(previewUrl);
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Share the picture of your awesome new tree!
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Name you tree (important!)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      What kind of tree did you plant?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type here"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Tell everyone about your newly planted tree!
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex flex-col w-full">
              <Button type="submit">Submit new tree</Button>
              <span className="w-full flex justify-center">OR</span>
              <Link
                href="/update"
                className={buttonVariants({ variant: "outline" })}
              >
                Update your existing tree
              </Link>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
