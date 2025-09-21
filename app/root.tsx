import {
    isRouteErrorResponse,
    Links,
    Meta,
    NavLink,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { version as appVersion } from "../package-lock.json";
import { UserConfigurationProvider } from "~/object-viewer/UserConfigurationContext";
import { BASE_NAME_URL_PREFIX } from "~/util/util";
import { HistoryContextProvider } from "./object-viewer/HistoryContext";
import { prettifiedBuildTime } from "./util/dateAndTime";

// export const links: Route.LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon-nnm-alternative-2.svg" />
                <Meta />
                <Links />
            </head>
            <body>
                <header>
                    <nav>
                        <NavLink
                            to={`${BASE_NAME_URL_PREFIX}/`}
                            className={({ isActive, isPending }) =>
                                isPending ? "pending" : isActive ? "active" : ""
                            }
                        >
                            Object Viewer
                        </NavLink>
                        <NavLink
                            to={`${BASE_NAME_URL_PREFIX}/about`}
                            className={({ isActive, isPending }) =>
                                isPending ? "pending" : isActive ? "active" : ""
                            }
                        >
                            About
                        </NavLink>
                    </nav>
                </header>

                {children}
                <ScrollRestoration />
                <Scripts />

                <footer>
                    <div>
                        <em>NNM Object Viewer</em> <var>{appVersion}</var>
                    </div>
                    <div>Built: {prettifiedBuildTime}</div>
                    <div>
                        Copyright &copy; 2025{" "}
                        <a href="https://anders.nemonisimors.com">Anders Gustafson</a> (
                        <a href="https://www.nemonisimors.com">www.nemonisimors.com</a>). All rights
                        reserved.
                    </div>
                    <div>
                        <em>Nemo nisi mors</em>
                    </div>
                    <div>
                        <img
                            src="./favicon-nnm-alternative-2.svg"
                            width={32}
                            height={32}
                            alt="Logo for NNM"
                        />
                    </div>

                    <div id="floating-logo">
                        <img
                            src="./LogoNNM_blue_transparent_background.svg"
                            width={80}
                            alt="Logo for NNM"
                        />
                        <div>Object Viewer</div>
                    </div>
                </footer>
            </body>
        </html>
    );
}

export default function App() {
    return (
        <UserConfigurationProvider>
            <HistoryContextProvider>
                <Outlet />
            </HistoryContextProvider>
        </UserConfigurationProvider>
    );
    // return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
    let message = "Oops!";
    let details = "An unexpected error occurred.";
    let stack: string | undefined;

    if (isRouteErrorResponse(error)) {
        message = error.status === 404 ? "404" : "Error";
        details =
            error.status === 404
                ? "The requested page could not be found."
                : error.statusText || details;
    } else if (import.meta.env.DEV && error && error instanceof Error) {
        details = error.message;
        stack = error.stack;
    }

    return (
        <main className="pt-16 p-4 container mx-auto">
            <h1>{message}</h1>
            <p>{details}</p>
            {stack && (
                <pre className="w-full p-4 overflow-x-auto">
                    <code>{stack}</code>
                </pre>
            )}
        </main>
    );
}
