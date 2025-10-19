import { envUrl, getCommonHeaders } from "../utils/auth";

type SpectrumDataInput = {
  deviceSerialNumbers: string[];
  eirpCarrier0?: boolean;
  eirpCarrier1?: boolean;
  eirpCarrier2?: boolean;
  eirpCarrier3?: boolean;
  palCount?: boolean;
  reason?: boolean;
  status?: boolean;
};

export async function getSpectrumDataQuery(params: {
  operatorId: string;
  input: SpectrumDataInput;
}) {
  const { operatorId, input } = params;
  const headers = getCommonHeaders(operatorId);

  const url =
    `${envUrl}/api/sds/v1/operationdetails/spectrumData`;

  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
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
    const message = `Failed to fetch spectrum data (${response.status} ${response.statusText})`;
    throw new Error(
      typeof errorBody === "string" || errorBody == null
        ? message
        : `${message}: ${JSON.stringify(errorBody)}`
    );
  }

  return contentType.includes("application/json")
    ? await response.json()
    : await response.text();
}


