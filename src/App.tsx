import { Route, Routes } from "react-router-dom"
import Footer from "./layout/Footer"
import Header from "./layout/Header"
import Home from "./pages/home/Home"
import React from "react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.min.css'
import SpinnerPage from "./components/SpinnerPage";


function App() {
  const SearchByCategories = React.lazy(() => import("./pages/search/category/MainSearchCategory"));
  const SearchByAuthorTitle = React.lazy(() => import("./pages/search/authorTitle/MainSearchAuthorTitle"));
  const SheetMusicsFromGroupId = React.lazy(() => import("./pages/sheetmusic/fromGroupId/MainSheetMusicGroupId"));
  const FavoriteSheetMusic = React.lazy(() => import("./pages/favorite/MainSheetMusicFavorite"));
  const MadeBy = React.lazy(() => import("./pages/madeBy/MainMadeBy"));
  const TeachingOrLiterature = React.lazy(() => import("./pages/search/teachingLiterature/MainTeachingLiterature"));
  const TeachingOrLiteratureFromGroupId = React.lazy(() => import("./pages/search/teachingLiterature/fromGroupId/MainTeachingLiteratureGroupId"));

  return (
    <>
      <ToastContainer
        className={"toastContainer"}
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <Header></Header>
      <main className="grow">
        <Routes>

          <Route path="/" element={<Home></Home>}></Route>

          {/**********************SEARCH**************************/}
          <Route path="/search">


            <Route path="category" element={
              <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
                <SearchByCategories></SearchByCategories>
              </React.Suspense>
            }></Route>
            <Route path="author_or_title" element={
              <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
                <SearchByAuthorTitle></SearchByAuthorTitle>
              </React.Suspense>
            }></Route>


            <Route path="teaching_or_literature">
              <Route path="" element={
                <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
                  <TeachingOrLiterature></TeachingOrLiterature>
                </React.Suspense>
              }></Route>
              <Route path="from_group" element={
                <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
                  <TeachingOrLiteratureFromGroupId></TeachingOrLiteratureFromGroupId>
                </React.Suspense>
              }></Route>
            </Route>


          </Route>
          {/***********************END SEARCH*************************/}
          <Route path="/sheetmusic">
            <Route path="from_group" element={
              <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
                <SheetMusicsFromGroupId></SheetMusicsFromGroupId>
              </React.Suspense>
            }></Route>
          </Route>

          <Route path="/favorites" element={
            <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
              <FavoriteSheetMusic></FavoriteSheetMusic>
            </React.Suspense>
          }></Route>

          <Route path="/madeby" element={
            <React.Suspense fallback={<SpinnerPage></SpinnerPage>}>
              <MadeBy></MadeBy>
            </React.Suspense>
          }></Route>
        </Routes>

      </main>
      <Footer></Footer>
    </>
  )
}

export default App
