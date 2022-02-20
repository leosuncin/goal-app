import Link from 'next/link';
import SignInAltIcon from '~icons/fa-solid/sign-in-alt.jsx';
import SignOutAltIcon from '~icons/fa-solid/sign-out-alt.jsx';
import UserIcon from '~icons/fa/user.jsx';

function Header() {
  let session = false;

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">GoalSetter</Link>
      </div>

      <ul>
        {session ? (
          <li>
            <button className="btn" type="button">
              <SignOutAltIcon /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <Link href="/login">
                <a>
                  <SignInAltIcon /> Login
                </a>
              </Link>
            </li>

            <li>
              <Link href="/register">
                <a>
                  <UserIcon /> Register
                </a>
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
