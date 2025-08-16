
// In-memory "database" for demo requests.
export type DemoRequest = {
  id: string;
  studentName: string;
  phone: string;
  email: string;
  activityName: string;
  preferredDate: string; // ISO date string
  requestDate: string; // ISO date string
  status: 'Pending' | 'Confirmed' | 'Completed';
};

let demoRequests: DemoRequest[] = [];
let nextId = 1;

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getDemoRequests = async (): Promise<DemoRequest[]> => {
  await delay(300);
  return Promise.resolve(demoRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()));
};

type AddDemoRequestData = {
  studentName: string;
  phone: string;
  email: string;
  activityName: string;
  preferredDate: Date;
}

export const addDemoRequest = async (data: AddDemoRequestData): Promise<DemoRequest> => {
  await delay(500);
  const newId = `DEMO${String(nextId++).padStart(4, '0')}`;
  const newRequest: DemoRequest = {
    ...data,
    id: newId,
    preferredDate: data.preferredDate.toISOString(),
    requestDate: new Date().toISOString(),
    status: "Pending",
  };
  demoRequests.unshift(newRequest);
  return Promise.resolve(newRequest);
};

export const updateDemoRequestStatus = async (id: string, status: DemoRequest['status']): Promise<DemoRequest> => {
    await delay(300);
    const requestIndex = demoRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
        throw new Error("Demo request not found");
    }
    demoRequests[requestIndex].status = status;
    return Promise.resolve(demoRequests[requestIndex]);
}

export const resetDemoRequests = () => {
    demoRequests = [];
    nextId = 1;
}
