import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import axios from "axios";

const withAuth = (WrappedComponent) => {
  const C = (props) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    //TODO: redirect to login page if logout

    useEffect(() => {
      const token = localStorage.getItem("token");
      if (token) {
        const { userId } = jwt.verify(token, process.env.JWT_SECRET);
        axios.get(`/api/user/${userId}`).then((res) => {
          setUser(res.data.data);
        });
      } else {
        router.replace("/");
      }
    }, []);

    if (user) {
      return <WrappedComponent user={user} {...props} />;
    } else {
      return null;
    }
  };

  return C;
};

export default withAuth;
