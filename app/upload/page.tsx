"use client";

import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
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
});

function Page() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const [preview, setPreview] = useState("/tree.jpg");

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
  };

  const fileRef = form.register("file");

  return (
    <div className="w-full flex justify-center items-center">
      <div className="flex flex-col items-center w-full gap-2 px-4">
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

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default Page;
