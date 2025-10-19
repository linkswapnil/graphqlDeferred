import { getDevicesDataQuery } from "./getDevicesData";
import { getSpectrumDataQuery } from "./getSpectrumData";

type DeviceFilter = {
  type?: string;
  savedConfig?: boolean;
  reportedConfig?: boolean;
  reportedState?: boolean;
};

type SpectrumInput = {
  deviceSerialNumbers: string[];
  eirpCarrier0?: boolean;
  eirpCarrier1?: boolean;
  eirpCarrier2?: boolean;
  eirpCarrier3?: boolean;
  palCount?: boolean;
  reason?: boolean;
  status?: boolean;
};

export async function getAllDevicesDataQuery(params: {
  operatorId: string;
  networkEntity: string;
  ids?: number[];
  deviceFilter: DeviceFilter;
  offset?: number;
  count?: number;
  spectrumInput?: Omit<SpectrumInput, "deviceSerialNumbers">;
}) {
  const {
    operatorId,
    ids,
    networkEntity,
    deviceFilter,
    offset = 0,
    count = 5000,
    spectrumInput,
  } = params;

  const allDevices: any[] = [];

  const nisArgs: any = { operatorId, networkEntity, offset, count, deviceFilter, ids };
  const devicesData = await getDevicesDataQuery(nisArgs);

  const items: any[] = Array.isArray(devicesData?.data) ? devicesData.data : [];
  allDevices.push(...items);

  // If spectrum requested, fetch in batches
  let spectrumBySerial: Record<string, any> | undefined;
  if (spectrumInput && allDevices.length) {
    spectrumBySerial = {};
    const serials = allDevices
      .map((d) => d?.serialNumber)
      .filter((s): s is string => typeof s === "string" && s.length > 0);
    const spectrumData = await getSpectrumDataQuery({
      operatorId,
      input: { deviceSerialNumbers: serials, ...spectrumInput },
    });
    spectrumBySerial = spectrumData;
  }

  // Merge spectrum into devices if available
  if (!spectrumBySerial) {
    return allDevices.map((d) => ({ device: d, spectrum: {} }));
  }
  return allDevices.map((d) => ({
    device: d,
    spectrum: spectrumBySerial![d.serialNumber] ?? {},
  }));
}


