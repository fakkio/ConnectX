import appInfo from "../../package.json";

export function getRelease() {
  return `${appInfo.name}@${getVersion()}`;
}

export function getVersion() {
  const commitSha =
    process.env.NODE_ENV === "development"
      ? ".local-dev"
      : process.env.VERCEL_ENV === "preview" &&
          process.env.VERCEL_GIT_COMMIT_SHA
        ? "." + process.env.VERCEL_GIT_COMMIT_SHA.substring(0, 7)
        : "";

  return `${appInfo.version}${commitSha}`;
}
