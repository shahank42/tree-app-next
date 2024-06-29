"use client";

import React, { useState } from "react";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUserStore } from "@/lib/stores/user";
import Image from "next/image";
import { RecordModel } from "pocketbase";
import { pb } from "@/lib/pbClient";

const formSchema = z.object({
  nameId: z.string(),
  file: z.instanceof(FileList),
});

function UpdateForm({ userTrees }: {
  userTrees: RecordModel[];
}) {
  const [preview, setPreview] = useState("/tree.jpg");
  const [selectedFile, setSelectedFile] = useState<Blob>();


  const user = useUserStore((state) => state.user);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log(data);
    if (selectedFile) {
      const formData = new FormData();
      formData.append("picUrl", selectedFile);
      formData.append("tree_id", data.nameId);
      formData.append("user_id", user.id);
      const createdRecordTreeImages = await pb
        .collection("tree_images")
        .create(formData);
    }
  };

  const fileRef = form.register("file");

  return (
    <Form {...form}>
      <div className="relative size-64">
        <Image
          src={preview}
          alt="its a pic"
          fill
          objectFit="cover"
          className="rounded-lg"
        />
      </div>

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
                    Share the picture of your awesome tree!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="nameId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Which tree do you wish to update?</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select one of your trees" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {userTrees?.map((tree) => (
                      <SelectItem key={tree.id} value={tree.id}>
                        {tree.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Add image for tree</Button>
      </form>
    </Form>
  );
}

export default UpdateForm;
