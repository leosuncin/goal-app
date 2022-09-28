import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import SignInAltIcon from '~icons/fa-solid/sign-in-alt.jsx';
import SignOutAltIcon from '~icons/fa-solid/sign-out-alt.jsx';
import UserIcon from '~icons/fa/user.jsx';

import styles from '~app/components/Header.module.css';

function Header() {
  const { status } = useSession();
  const isAuthenticated = status === 'authenticated';

  return (
    <header className={styles.header}>
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
              <Link href="/auth/login">
                <a>
                  <SignInAltIcon /> Login
                </a>
              </Link>
            </li>

            <li>
              <Link href="/auth/register">
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
