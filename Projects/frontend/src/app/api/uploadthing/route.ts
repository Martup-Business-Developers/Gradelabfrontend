// Resource: https://docs.uploadthing.com/nextjs/appdir#create-a-nextjs-api-route-using-the-filerouter
import { ourFileRouter } from "./core";
import { createRouteHandler } from "uploadthing/server";

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
    router: ourFileRouter,
});