import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
  callService,
  type Connection,
  type HassEntities,
} from "home-assistant-js-websocket";

let connection: Connection | null = null;

export async function connect(url: string, token: string): Promise<Connection> {
  if (connection) return connection;
  const auth = createLongLivedTokenAuth(url, token);
  connection = await createConnection({ auth });
  return connection;
}

export function subscribeToEntities(
  conn: Connection,
  callback: (entities: HassEntities) => void
) {
  return subscribeEntities(conn, callback);
}

export async function callHA(
  conn: Connection,
  domain: string,
  service: string,
  data?: Record<string, unknown>,
  target?: { entity_id: string | string[] }
) {
  return callService(conn, domain, service, data, target);
}

export function disconnect() {
  connection?.close();
  connection = null;
}
