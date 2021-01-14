import { gql } from "@apollo/client";
import AccessDeniedIndicator from "components/access-denied-indicator";
import Page from "components/pages/my-account";
import { initializeApollo } from "lib/apolloClient";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Head from "next/head";
import React, { FC } from "react";

const usersQuery = gql`
  query fetchUser($userId: uuid!) {
    users_by_pk(id: $userId) {
      id
      name
    }
  }
`;

const MyAccountPage: FC<any> = ({ session, user }) => {
  if (!session) {
    return <AccessDeniedIndicator />;
  }

  return (
    <>
      <Head>
        <title>My Account Page</title>
      </Head>
      <Page user={user} />
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  const apolloClient = initializeApollo({}, session?.token);

  const { data } = await apolloClient.query({
    query: usersQuery,
    variables: {
      userId: session?.id,
    },
  });

  return {
    props: {
      session,
      user: data.users_by_pk,
    },
  };
};

export default MyAccountPage;
