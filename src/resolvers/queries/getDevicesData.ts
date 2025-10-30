import { envUrl, getCommonHeaders } from "../utils/auth";

type DeviceFilter = {
  type?: string;
  savedConfig?: boolean;
  reportedConfig?: boolean;
  reportedState?: boolean;
  connected?: boolean;
};

export async function getDevicesDataQuery(params: {
  operatorId: string;
  networkEntity: string;
  offset: number;
  count: number;
  deviceFilter?: DeviceFilter;
  ids?: number[];
}) {
  const { operatorId, networkEntity, offset, count, deviceFilter, ids } = params;
  const headers = getCommonHeaders(operatorId);

  let entityIds: number[] = ids ?? [];
  let networkEntityInvalid = networkEntity

  // make api fail for testing
  if (offset === 2) {
    entityIds=[999, 888]
    networkEntityInvalid = "abc"
  }
  const baseUrl =
    `${envUrl}/api/nqs/v1`;
  const url = new URL(
    `${baseUrl}/${encodeURIComponent(networkEntityInvalid)}/devices/search`
  );
  url.searchParams.set("offset", String(offset));
  url.searchParams.set("count", String(count));

  console.log("nis api call url::", url.toString());

  const filterWithDefaults: any = {
    type: deviceFilter?.type ?? "BN",
    savedConfig: deviceFilter?.savedConfig ?? false,
    reportedConfig: deviceFilter?.reportedConfig ?? false,
    reportedState: deviceFilter?.reportedState ?? true,
    // connected: deviceFilter?.connected ?? true,
  };

  if(deviceFilter?.connected !== undefined) {
    filterWithDefaults.connected = deviceFilter.connected;
  }

  const body: Record<string, unknown> = {
    ...(entityIds && entityIds.length ? { ids: entityIds } : {}),
    deviceFilter: filterWithDefaults,
  };

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const contentType = response.headers.get("content-type") || "";

  if (!response.ok) {
    let errorBody: any = undefined;
    try {
      errorBody = contentType.includes("application/json")
        ? await response.json()
        : await response.text();
    } catch {
      // ignore parse error
    }
    const message = `Failed to fetch devices (${response.status} ${response.statusText})`;
    console.log("error message::", message);
    return { data: [], offset: offset, totalCount: 0 };
    // throw new Error(
    //   typeof errorBody === "string" || errorBody == null
    //     ? message
    //     : `${message}: ${JSON.stringify(errorBody)}`
    // );
  }
  

  if (contentType.includes("application/json")) {
    const json = await response.json();
    const items = Array.isArray(json?.items)
      ? json.items
      : Array.isArray(json?.data?.items)
      ? json.data.items
      : [];
    return { data: items, offset: json.data.offset, totalCount: json.data.totalCount };
  }
  return { data: [] };
}


