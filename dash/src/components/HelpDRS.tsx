import DriverDRS from "./DriverDRS";

export default function HelpDRS() {
  return (
    <div>
      <h3 className="mt-4 text-2xl font-semibold">DRS & PIT Status</h3>

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-20">
            <DriverDRS possible={true} on={false} driverStatus={null} />
          </div>
          <p>Possible: Gap is smaller than 1 Second</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-20">
            <DriverDRS possible={true} on={true} driverStatus={null} />
          </div>
          <p>Active: DRS is open</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-20">
            <DriverDRS possible={false} on={false} driverStatus={"PIT"} />
          </div>
          <p>Either in the PITs or Exiting the PITs</p>
        </div>
      </div>
    </div>
  );
}
