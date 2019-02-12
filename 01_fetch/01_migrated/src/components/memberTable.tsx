import * as React from "react";
import { MemberEntity } from "../model/member";
import { memberAPI } from "../api/memberAPI";
import { MemberRow } from "./memberRow";
import { MemberHead } from "./memberHead";

interface Props {}

function useMembers() {
  const [members, setMembers] = React.useState<MemberEntity[]>([]);

  const loadMembers = () => {
    memberAPI.getAllMembers().then(members => setMembers(members));
  };

  return { members, loadMembers };
}

export const MemberTableComponent = () => {
  const { members, loadMembers } = useMembers();

  React.useEffect(() => {
    loadMembers();
  }, []);

  return (
    <table className="table">
      <thead>
        <MemberHead />
      </thead>
      <tbody>
        {members.map((member: MemberEntity) => (
          <MemberRow key={member.id} member={member} />
        ))}
      </tbody>
    </table>
  );
};
