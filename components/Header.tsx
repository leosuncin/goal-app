import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import SignInAltIcon from '~icons/fa-solid/sign-in-alt.jsx';
import SignOutAltIcon from '~icons/fa-solid/sign-out-alt.jsx';
import UserIcon from '~icons/fa/user.jsx';

function Header() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className="header">
      <div className="logo">
        <Link href="/">GoalSetter</Link>
      </div>

      <ul>
        {isAuthenticated ? (
          <li>
            <button className="btn" type="button" onClick={() => signOut()}>
              <SignOutAltIcon /> Logout
            </button>
          </li>
        ) : (
          <>
            <li>
              <button type="button" className="btn" onClick={() => signIn()}>
                <SignInAltIcon /> Login
              </button>
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
