"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getToken } from "@/lib/firebase/getToken";
import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Group } from "@/app/models/communityModel";

const getGroupList = async () => {
    const token = await getToken();
    const res = await fetch('https://sungminna.com/api/community/groups', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch forum data');
    }
    return res.json();
  }

export default function Component() {
  const createGroup = async () => {
    const token = await getToken();
    const res = await fetch('https://sungminna.com/api/community/groups/', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
      body: JSON.stringify({'name': groupName}), 
    });
    if(!res.ok){
      throw new Error('Faild to fetch group data');
    }
    setGroupName("");
    fetchData();
    return res.json();
  }

  const deleteGroup = async (id: string) => {
    const token = await getToken();
    const res = await fetch(`https://sungminna.com/api/community/groups/${id}`, {
      method: 'DELETE', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch group data');
    }
    fetchData();
  }

  const joinGroup = async (id:string) => {
    const token = await getToken();
    const res = await fetch(`https://sungminna.com/api/community/users/join_group/`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
      body: JSON.stringify({'group_id': id}), 
    });
    if(!res.ok){
      throw new Error('Faild to fetch group data');
    }
    return res.json();
  }

  const leaveGroup = async (id:string) => {
    const token = await getToken();
    const res = await fetch(`https://sungminna.com/api/community/users/leave_group/`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
      body: JSON.stringify({'group_id': id}), 
    });
    if(!res.ok){
      throw new Error('Faild to fetch group data');
    }
    return res.json();
  }
  const getUserGroupList = async () => {
    const token = await getToken();
    const res = await fetch('https://sungminna.com/api/community/users/groups', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}`, 
      }, 
      cache: "no-cache", 
    });
    if(!res.ok){
      throw new Error('Faild to fetch forum data');
    }
    return res.json();
  } 

  
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState("");
  const [groupsId, setGroupsId] = useState<String[]>([]);
  const fetchData = useCallback(async() => {
  try{
    const groups = await getGroupList();
    const userGroupList = await getUserGroupList();
    setGroups(groups);
    let arr: String[] = [];
    if (userGroupList.length !== 0){
      arr = userGroupList.map((group: Group) => group.id.toString());
    }
    else{
      arr = [];
    }
    setGroupsId(arr);
  }
  catch (error) {
    console.error(error);
  }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Group</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-3">
          <Button onClick={createGroup}>Create</Button>
          <div className="grid gap-3">
            <Label htmlFor="groupName">GroupName</Label>
              <Input
                id="groupName"
                type="text"
                className="w-full"
                placeholder='write groupName here!'
                defaultValue=""
                onChange={(e) => setGroupName(e.target.value)}
              />
            <Label htmlFor="category">Category</Label>
            <Select>
              <SelectTrigger id="category" aria-label="Select category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="clothing">Clothing</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="accessories">Accessories</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Group Id</TableHead>
              <TableHead>Group Name</TableHead>
              <TableHead>Control</TableHead>
              <TableHead>Join</TableHead>
              <TableHead>Leave</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              Array.isArray(groups) && groups.map((group: Group, index: number) => (
                  <TableRow key={ index }>
                    <TableCell className="font-medium">{group.id}</TableCell>
                    <TableCell>{group.name}</TableCell>
                    <TableCell>
                      <Button onClick={() => deleteGroup(group.id)}>Delete</Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => joinGroup(group.id)}
                        disabled={(groupsId.includes(group.id.toString()))}
                        >Join</Button>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => leaveGroup(group.id)}
                        disabled={!(groupsId.includes(group.id.toString()))}
                        >Leave</Button>
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
        </div>
      </CardContent>
    </Card>
  )
}
