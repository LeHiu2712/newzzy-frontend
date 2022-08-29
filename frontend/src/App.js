import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateNews from './components/newsPage/CreateNews';
import Footer from './Footer';
import ForumPage from './components/forumPage/ForumPage';
import Navbar from './Navbar';
import NewsPage from './components/newsPage/NewsPage';
import Login from './components/login_signup/Login';
import Signup from './components/login_signup/Signup';
import ReportPage from './components/newsPage/ReportPage';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import MyProfile from './components/profilePage/MyProfile';
import authHeader from './components/login_signup/authHeader';
import EditNews from './components/newsPage/EditNews';
import CategorizedNews from './components/newsPage/CategorizedNews';
import BreakingNewsPage from './components/newsPage/BreakingNewsPage';
import CategorizedPost from './components/forumPage/CategorizedPost';
import PostDetail from './components/forumPage/PostDetail';
import Popular from './components/forumPage/Popular';
import EmailReset from './components/login_signup/EmailReset';
import ResetPasswordForm from './components/login_signup/ResetPasswordForm';
function App() {
  //Authorization
  const [isAdmin, setIsAdmin] = useState(false)
  const [isReporter, setIsReporter] = useState(false)
  const [isUser, setIsUser] = useState(false)
  const [isPublic, setIsPublic] = useState(false)
  const [currentUser, setCurrentUser] = useState(undefined)
  const endPoint = "http://localhost:9000/auth"

  const checkAdmin = () => {
    fetch(endPoint + "/admin", {
      headers: authHeader()
    }).then(res => res.json()).then(data => setIsAdmin(data.isAdmin))
  }
  const checkReporter = () => {
    fetch(endPoint + "/reporter", {
      headers: authHeader()
    }).then(res => res.json()).then(data => setIsReporter(data.isReporter))
  }
  const checkUser = () => {
    fetch(endPoint + "/user", {
      headers: authHeader()
    }).then(res => res.json()).then(data => setIsUser(data.isUser))
  }
  const checkPublic = () => {
    fetch(endPoint + "/public", {
    }).then(res => res.json()).then(data => setIsPublic(data.isPublic))
  }
  useEffect(() => {
    checkPublic()
    const currentUser = JSON.parse(localStorage.getItem("user"))
    if(currentUser){
      setCurrentUser(currentUser)
      console.log('hello')
      checkUser();
      checkAdmin();
      checkReporter()
    }
    console.log(isPublic)
  }, []
  )
  
  return (
    <div>
      {isPublic &&
      <Router>
        <Navbar isUser = {isUser} currentUser = {currentUser} isReporter = {isReporter}/>
        <Switch>
          <Route exact path="/"><NewsPage /></Route>
          <Route exact path="/category/:cateId"><CategorizedNews /></Route>
          <Route exact path="/breaking"><BreakingNewsPage /></Route>
          <Route exact path="/forum"><ForumPage isUser = {isUser}/></Route>
          <Route exact path="/forum/categorized/:categorized_id"><CategorizedPost isUser = {isUser}/></Route>
          <Route exact path="/forum/popular"><Popular isUser = {isUser}/></Route>
          <Route exact path="/forum/post/postdetail/:id"><PostDetail isAdmin={isAdmin} isUser={isUser}/></Route>
          <Route exact path="/login"><Login /></Route>
          <Route exact path="/login/:verified"><Login /></Route>
          <Route exact path="/signup"><Signup /></Route>
          <Route exact path="/articles/:id"><ReportPage isUser = {isUser} currentUser = {currentUser} isReporter ={isReporter}/></Route>
          {isReporter && <Route exact path="/editnews/:id"><EditNews isUser = {isUser} currentUser = {currentUser}/></Route>}
          {isReporter &&<Route exact path="/articleform"><CreateNews isUser = {isUser} currentUser = {currentUser}/></Route>}
          <Route exact path="/profile/:id"><MyProfile isUser = {isUser}/></Route>
          <Route exact path="/emailresetform"><EmailReset /></Route>
          <Route exact path="/password-reset/:id/:token"><ResetPasswordForm /></Route>
        </Switch>
        <Footer />
      </Router>}
    </div>
  );
}



export default App;
