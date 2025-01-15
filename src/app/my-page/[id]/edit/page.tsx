"use client";

import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  //1. get id
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchId = async () => {
      const { id } = await params;
      setUserId(id);
    };
    fetchId();
    console.log(userId);
  }, [params, userId]);

  //2. get user data - have to make api
  const { data } = useQuery<User>({
    queryKey: ["user"],
    queryFn: async () => {
      const res = await axios.get("/api/user");
      return res.data;
    },
  });

  //3. make form
  //4. update user data - have to make api
  //5. go back to my page
  return <div>회원정보 수정</div>;
}
