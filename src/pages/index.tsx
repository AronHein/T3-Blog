import React from "react";
import MainLayout from "../layouts/MainLayout";
import WriteFormModal from "../components/WriteFormModal/Index";
import MainSection from "../components/MainSection/Index";

const HomePage = () => {
  return (
    <MainLayout>
      <section className="grid grid-cols-12">
        <MainSection />
      </section>
      <WriteFormModal />
    </MainLayout>
  );
};

export default HomePage;
