import { Link } from "react-router-dom";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { LoadingSpinner } from "./common/components/LoadingSpinner";
import ButtonPrimary from "./common/components/buttons/ButtonPrimary";
import useCurrentUser from "./common/hooks/useCurrentUser";

const isSafari = () =>
  navigator.userAgent.toLowerCase().indexOf("safari/") > -1;

export const Login = () => {
  const center = {
    position: "absolute" as any,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  };
  const auth = getAuth();
  const [user, loading] = useCurrentUser();
  const login = async () => {
    // NOTE: could change implementation, this requires 3rd party cookies
    const provider = new GoogleAuthProvider();

    try {
      // (hopefully) temporary workaround until https://github.com/firebase/firebase-js-sdk/issues/6716 is fixed
      if (isSafari()) {
        signInWithPopup(auth, provider);
      } else {
        signInWithRedirect(auth, provider);
      }
    } catch (error) {
      alert(error);
    }

    return <LoadingSpinner />;
  };
  if (loading) {
    return (
      <div>
        <p>Initialising User...</p>
      </div>
    );
  }
  if (user) {
    return (
      <div>
        <p>Current User: {user.email}</p>
        <Link to="/">Start using app</Link>
      </div>
    );
  }
  return (
    <>
      <ButtonPrimary style={center} onClick={login}>
        Log in
      </ButtonPrimary>
      3rd party cookies must be enabled
    </>
  );
};
