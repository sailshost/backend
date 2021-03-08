import { RouteOptions } from "fastify";
import Docker from "dockerode";
import random from "project-name-generator";

const docker = new Docker({ socketPath: "/var/run/docker.sock" });

export const createContainer: RouteOptions = {
  method: "POST",
  url: "/create",
  handler: async (req, res) => {
    const containerName = random.generate({ number: true }).dashed;
    try {
      const container = await docker.createContainer({
        Image: "ubuntu",
        Cmd: ["/bin/bash"],
        Tty: true,
        name: containerName
      });
      
      await container.start().then(async () => {
        await container.exec({ 
          Cmd: ["apt-get update"]
        });
      })

      
      return {
        name: containerName
      }
    } catch (err) {
      // send a request to sentry
      // Sentry.Logger(`[Container-Backend] ${err.stack}`);
      // this should be the sentry code.
      const code = err.stack;
      return {
        error: `This error has been reported to our team, please try again. - ${code}.`
      }
    }
  }
}

export const deleteContainer: RouteOptions = {
  method: "DELETE",
  url: "/delete",
  handler: async (req, res) => {
    const { name } = req.body as any;
    try {
      docker.getContainer(name).stop().catch(console.error)
      docker.getContainer(name).remove().catch(console.error)
      return {
        ok: true
      }
    } catch (err) {
      const code = "code";
      error: `This error has been reported to our team, please try again. - ${code}.`
    }
  }
}

export const restartContainer: RouteOptions = {
  method: "POST",
  url: "/restart",
  handler: async (req, res) => {
    const { name } = req.body as any;
    try {
      docker.getContainer(name).restart();
      return {
        ok: true
      }
    } catch (err) {
      const code = "code";
      error: `This error has been reported to our team, please try again. - ${code}.`
    }
  }
}

export const stopContainer: RouteOptions = {
  method: "POST",
  url: "/stop",
  handler: async (req, res) => {
    const { name } = req.body as any;
    try {
      docker.getContainer(name).stop();
      return {
        ok: true
      }
    } catch (err) {
      const code = "code";
      error: `This error has been reported to our team, please try again. - ${code}.`
    }
  }
}
