import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Heading,
} from "@react-email/components";
import * as React from "react";

export default function Email(props) {
  const { to } = props;
  return (
    <Html>
      <Heading as="h1">Thanks for your help!</Heading>
      <Text>The MORE team is working on your application, we will contact you when we have more news.</Text>
    </Html>
  );
}
