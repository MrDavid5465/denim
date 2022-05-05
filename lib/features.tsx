import { IUser } from "./queries";

export function isInRole(my: Partial<IUser>, app: string, role: string) {
  const result =
    my.applications &&
    my.applications
      .find((a) => a.name === app)
      ?.roles?.find((r) => r.name === role)
      ?.groupNames?.filter((gn) => {
        var groups: string[] | undefined = my.groups?.map(
          (g) => g.sAMAccountName
        );
        return groups?.includes(gn);
      }).length;
  return result ? result > 0 : false;
}
