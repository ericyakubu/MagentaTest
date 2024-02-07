import { FunctionComponent } from "react";
import classes from "./Welcome.module.scss";
import { Link } from "react-router-dom";

const Welcome: FunctionComponent = () => {
  return (
    <main className={classes.Welcome}>
      <h1>Welcome!</h1>
      <Link to="/table">
        Ever wondered if you missed something from Star Wars? Take a look!
      </Link>
    </main>
  );
};

export default Welcome;
