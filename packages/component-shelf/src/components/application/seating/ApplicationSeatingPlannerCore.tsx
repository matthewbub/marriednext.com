"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Plus,
  Settings2,
  ArrowLeft,
  Search,
  GripVertical,
  AlertTriangle,
  Users,
  CircleDot,
  Square,
  RectangleHorizontal,
  X,
  Check,
  User,
  UserPlus,
  Sparkles,
} from "lucide-react";
import type { ApplicationLinkComponent } from "../link-types";

type TableType = "circle" | "square" | "rectangle";

interface Table {
  id: string;
  name: string;
  type: TableType;
  seats: number;
  x: number;
  y: number;
}

interface Guest {
  id: string;
  name: string;
  tableId: string | null;
  seatPosition: number | null;
}

interface SeatingPlannerCoreProps {
  isAuthenticated?: boolean;
  initialTables?: Table[];
  initialGuests?: Guest[];
  onDataChange?: (tables: Table[], guests: Guest[]) => void;
  Link?: ApplicationLinkComponent;
}

const defaultTables: Table[] = [
  { id: "1", name: "Head Table", type: "rectangle", seats: 8, x: 50, y: 10 },
  { id: "2", name: "Table 1", type: "circle", seats: 8, x: 20, y: 40 },
  { id: "3", name: "Table 2", type: "circle", seats: 8, x: 50, y: 40 },
  { id: "4", name: "Table 3", type: "circle", seats: 8, x: 80, y: 40 },
  { id: "5", name: "Table 4", type: "circle", seats: 10, x: 20, y: 70 },
  { id: "6", name: "Table 5", type: "circle", seats: 10, x: 50, y: 70 },
  { id: "7", name: "Table 6", type: "circle", seats: 10, x: 80, y: 70 },
];

const defaultGuests: Guest[] = [];

export function ApplicationSeatingPlannerCore({
  isAuthenticated = false,
  initialTables,
  initialGuests,
  onDataChange,
  Link = "a",
}: SeatingPlannerCoreProps) {
  const [tables, setTables] = useState<Table[]>(initialTables || defaultTables);
  const [guests, setGuests] = useState<Guest[]>(initialGuests || defaultGuests);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddTableDialog, setShowAddTableDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showAddGuestDialog, setShowAddGuestDialog] = useState(false);
  const [defaultSeatsPerTable, setDefaultSeatsPerTable] = useState(8);
  const [newTable, setNewTable] = useState({
    name: "",
    type: "circle" as TableType,
    seats: 8,
  });
  const [guestType, setGuestType] = useState<"single" | "plusone" | "group">(
    "single"
  );
  const [newGuestName, setNewGuestName] = useState("");
  const [newGroupNames, setNewGroupNames] = useState("");
  const [showCtaBanner, setShowCtaBanner] = useState(!isAuthenticated);

  // Notify parent of data changes
  useEffect(() => {
    onDataChange?.(tables, guests);
  }, [tables, guests, onDataChange]);

  const seatedCount = guests.filter((g) => g.tableId !== null).length;
  const unseatedCount = guests.filter((g) => g.tableId === null).length;
  const totalSeats = tables.reduce((acc, t) => acc + t.seats, 0);

  const getGuestsAtTable = (tableId: string) => {
    return guests
      .filter((g) => g.tableId === tableId)
      .sort((a, b) => (a.seatPosition || 0) - (b.seatPosition || 0));
  };

  const getUnseatedGuests = () => {
    return guests.filter((g) => g.tableId === null);
  };

  const allGuestsFiltered = guests.filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTable = () => {
    const newId = Date.now().toString();
    const newTableObj: Table = {
      id: newId,
      name: newTable.name || `Table ${tables.length}`,
      type: newTable.type,
      seats: newTable.seats,
      x: 50,
      y: 85,
    };
    setTables([...tables, newTableObj]);
    setNewTable({ name: "", type: "circle", seats: defaultSeatsPerTable });
    setShowAddTableDialog(false);
  };

  const handleAddGuest = () => {
    if (guestType === "group") {
      const names = newGroupNames.split("\n").filter((n) => n.trim());
      const newGuests: Guest[] = names.map((name, i) => ({
        id: `${Date.now()}-${i}`,
        name: name.trim(),
        tableId: null,
        seatPosition: null,
      }));
      setGuests([...guests, ...newGuests]);
    } else if (guestType === "plusone") {
      const newGuests: Guest[] = [
        {
          id: `${Date.now()}-1`,
          name: newGuestName.trim(),
          tableId: null,
          seatPosition: null,
        },
        {
          id: `${Date.now()}-2`,
          name: `${newGuestName.trim()}'s Guest`,
          tableId: null,
          seatPosition: null,
        },
      ];
      setGuests([...guests, ...newGuests]);
    } else {
      const newGuest: Guest = {
        id: Date.now().toString(),
        name: newGuestName.trim(),
        tableId: null,
        seatPosition: null,
      };
      setGuests([...guests, newGuest]);
    }
    setNewGuestName("");
    setNewGroupNames("");
    setShowAddGuestDialog(false);
  };

  const handleAssignGuest = (guestId: string, seatPosition: number) => {
    if (!selectedTable) return;
    setGuests(
      guests.map((g) =>
        g.id === guestId ? { ...g, tableId: selectedTable.id, seatPosition } : g
      )
    );
  };

  const handleRemoveGuest = (guestId: string) => {
    setGuests(
      guests.map((g) =>
        g.id === guestId ? { ...g, tableId: null, seatPosition: null } : g
      )
    );
  };

  const handleDeleteGuest = (guestId: string) => {
    setGuests(guests.filter((g) => g.id !== guestId));
  };

  const isGuestSeatedElsewhere = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    return guest?.tableId !== null && guest?.tableId !== selectedTable?.id;
  };

  const getGuestCurrentTable = (guestId: string) => {
    const guest = guests.find((g) => g.id === guestId);
    if (!guest?.tableId) return null;
    return tables.find((t) => t.id === guest.tableId);
  };

  if (selectedTable) {
    return (
      <TableDetailView
        table={selectedTable}
        guests={guests}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onBack={() => setSelectedTable(null)}
        onAssignGuest={handleAssignGuest}
        onRemoveGuest={handleRemoveGuest}
        getGuestsAtTable={getGuestsAtTable}
        allGuestsFiltered={allGuestsFiltered}
        isGuestSeatedElsewhere={isGuestSeatedElsewhere}
        getGuestCurrentTable={getGuestCurrentTable}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* CTA Banner for unauthenticated users */}
      {showCtaBanner && (
        <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-accent/5 p-4 sm:p-6">
          <button
            onClick={() => setShowCtaBanner(false)}
            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-serif text-lg font-semibold text-foreground">
                Enjoying the Seating Planner?
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Create a free account to save your work, sync across devices,
                and unlock your full wedding planning hub.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/dashboard">
                <Button>Create Free Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            Seating Planner
          </h1>
          <p className="text-muted-foreground mt-1">
            Arrange your guests across tables
          </p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Dialog
            open={showSettingsDialog}
            onOpenChange={setShowSettingsDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings2 className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Seating Settings</DialogTitle>
                <DialogDescription>
                  Configure default table settings
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Default seats per table</Label>
                  <Select
                    value={defaultSeatsPerTable.toString()}
                    onValueChange={(v) =>
                      setDefaultSeatsPerTable(Number.parseInt(v))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[6, 8, 10, 12].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} seats
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setShowSettingsDialog(false)}>
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Add Guest Dialog */}
          <Dialog
            open={showAddGuestDialog}
            onOpenChange={setShowAddGuestDialog}
          >
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Add Guest
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle className="font-serif">Add Guests</DialogTitle>
                <DialogDescription>
                  Add a single guest, guest with +1, or a group of guests.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Guest Type</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button
                      type="button"
                      variant={guestType === "single" ? "default" : "outline"}
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setGuestType("single")}
                    >
                      <User className="h-5 w-5" />
                      <span className="text-xs">Single</span>
                    </Button>
                    <Button
                      type="button"
                      variant={guestType === "plusone" ? "default" : "outline"}
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setGuestType("plusone")}
                    >
                      <UserPlus className="h-5 w-5" />
                      <span className="text-xs">Guest +1</span>
                    </Button>
                    <Button
                      type="button"
                      variant={guestType === "group" ? "default" : "outline"}
                      className="flex-col h-auto py-3 gap-1"
                      onClick={() => setGuestType("group")}
                    >
                      <Users className="h-5 w-5" />
                      <span className="text-xs">Group</span>
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="guestName">
                    {guestType === "group"
                      ? "Guest Names (one per line)"
                      : "Guest Name"}
                  </Label>
                  {guestType === "group" ? (
                    <textarea
                      id="guestName"
                      value={newGroupNames}
                      onChange={(e) => setNewGroupNames(e.target.value)}
                      className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      placeholder="John Smith&#10;Jane Smith&#10;Jimmy Smith"
                    />
                  ) : (
                    <Input
                      id="guestName"
                      value={newGuestName}
                      onChange={(e) => setNewGuestName(e.target.value)}
                      placeholder="Full name"
                    />
                  )}
                </div>

                {guestType === "plusone" && (
                  <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 p-3">
                    <UserPlus className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm">
                      <p className="font-medium">Plus One Enabled</p>
                      <p className="text-muted-foreground">
                        An additional guest slot will be created
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddGuestDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddGuest}
                  disabled={
                    guestType === "group"
                      ? !newGroupNames.trim()
                      : !newGuestName.trim()
                  }
                >
                  Add Guest{guestType === "group" ? "s" : ""}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={showAddTableDialog}
            onOpenChange={setShowAddTableDialog}
          >
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Table</DialogTitle>
                <DialogDescription>
                  Create a new table for your seating arrangement
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Table Name</Label>
                  <Input
                    placeholder="e.g., Table 7"
                    value={newTable.name}
                    onChange={(e) =>
                      setNewTable({ ...newTable, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Table Shape</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      {
                        type: "circle" as TableType,
                        icon: CircleDot,
                        label: "Circle",
                      },
                      {
                        type: "square" as TableType,
                        icon: Square,
                        label: "Square",
                      },
                      {
                        type: "rectangle" as TableType,
                        icon: RectangleHorizontal,
                        label: "Rectangle",
                      },
                    ].map((option) => (
                      <button
                        key={option.type}
                        onClick={() =>
                          setNewTable({ ...newTable, type: option.type })
                        }
                        className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-colors ${
                          newTable.type === option.type
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <option.icon className="h-6 w-6" />
                        <span className="text-xs">{option.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Number of Seats</Label>
                  <Select
                    value={newTable.seats.toString()}
                    onValueChange={(v) =>
                      setNewTable({ ...newTable, seats: Number.parseInt(v) })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[4, 6, 8, 10, 12, 14, 16].map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} seats
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddTableDialog(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddTable}>Add Table</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <Card>
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-border">
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Tables</p>
              <p className="text-2xl font-semibold mt-1">{tables.length}</p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Total Seats</p>
              <p className="text-2xl font-semibold mt-1">{totalSeats}</p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Guests Seated</p>
              <p className="text-2xl font-semibold text-green-600 mt-1">
                {seatedCount}
              </p>
            </div>
            <div className="flex-1 p-4 text-center">
              <p className="text-sm text-muted-foreground">Unseated</p>
              <p className="text-2xl font-semibold text-amber-600 mt-1">
                {unseatedCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floor Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Floor Plan</CardTitle>
          <CardDescription>Click on a table to manage seating</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-muted/30 rounded-lg border-2 border-dashed border-border min-h-[500px] p-4">
            {/* Grid background */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Tables */}
            {tables.map((table) => {
              const guestsAtTable = getGuestsAtTable(table.id);
              const fillPercentage = (guestsAtTable.length / table.seats) * 100;

              return (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{ left: `${table.x}%`, top: `${table.y}%` }}
                >
                  <div
                    className={`relative flex flex-col items-center justify-center transition-all hover:scale-110 ${
                      table.type === "rectangle"
                        ? "w-32 h-16 rounded-lg"
                        : table.type === "square"
                        ? "w-20 h-20 rounded-lg"
                        : "w-20 h-20 rounded-full"
                    } bg-card border-2 border-primary/30 shadow-md hover:shadow-lg hover:border-primary`}
                  >
                    {/* Fill indicator */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 bg-primary/20 transition-all ${
                        table.type === "rectangle"
                          ? "rounded-b-lg"
                          : table.type === "square"
                          ? "rounded-b-lg"
                          : "rounded-b-full"
                      }`}
                      style={{ height: `${fillPercentage}%` }}
                    />
                    <span className="relative text-xs font-medium text-foreground">
                      {table.name}
                    </span>
                    <span className="relative text-xs text-muted-foreground">
                      {guestsAtTable.length}/{table.seats}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Unseated Guests */}
      {guests.length > 0 && (
        <Card
          className={unseatedCount > 0 ? "border-amber-200 bg-amber-50/50" : ""}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users
                  className={`h-5 w-5 ${
                    unseatedCount > 0
                      ? "text-amber-600"
                      : "text-muted-foreground"
                  }`}
                />
                <CardTitle
                  className={unseatedCount > 0 ? "text-amber-900" : ""}
                >
                  {unseatedCount > 0
                    ? `Unseated Guests (${unseatedCount})`
                    : `All ${guests.length} Guests Seated`}
                </CardTitle>
              </div>
              {unseatedCount > 0 && (
                <p className="text-sm text-amber-700">
                  Click a table above to assign guests
                </p>
              )}
            </div>
          </CardHeader>
          {unseatedCount > 0 && (
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {getUnseatedGuests().map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center gap-3 rounded-lg border border-amber-200 bg-card p-3 transition-colors hover:bg-amber-100/50 group"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-sm font-medium text-amber-700">
                      {guest.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {guest.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Not assigned
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteGuest(guest.id)}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 flex items-center justify-center rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      )}

      {/* Empty state for no guests */}
      {guests.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground mb-1">
              No guests yet
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-sm">
              Add your wedding guests to start planning your seating
              arrangement.
            </p>
            <Button onClick={() => setShowAddGuestDialog(true)}>
              <UserPlus className="h-4 w-4 mr-2" />
              Add Your First Guest
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

interface TableDetailViewProps {
  table: { id: string; name: string; type: TableType; seats: number };
  guests: Guest[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onBack: () => void;
  onAssignGuest: (guestId: string, seatPosition: number) => void;
  onRemoveGuest: (guestId: string) => void;
  getGuestsAtTable: (tableId: string) => Guest[];
  allGuestsFiltered: Guest[];
  isGuestSeatedElsewhere: (guestId: string) => boolean;
  getGuestCurrentTable: (
    guestId: string
  ) => { id: string; name: string } | null | undefined;
}

function TableDetailView({
  table,
  guests,
  searchQuery,
  setSearchQuery,
  onBack,
  onAssignGuest,
  onRemoveGuest,
  getGuestsAtTable,
  allGuestsFiltered,
  isGuestSeatedElsewhere,
  getGuestCurrentTable,
}: TableDetailViewProps) {
  const [draggedGuest, setDraggedGuest] = useState<string | null>(null);
  const [showReassignWarning, setShowReassignWarning] = useState<{
    guestId: string;
    seatPosition: number;
  } | null>(null);

  const seatedGuests = getGuestsAtTable(table.id);
  const radius = 120;
  const itemSize = 48;

  const getAvailableSeatPositions = () => {
    const occupied = seatedGuests.map((g) => g.seatPosition);
    return Array.from({ length: table.seats }, (_, i) => i + 1).filter(
      (pos) => !occupied.includes(pos)
    );
  };

  const handleDrop = (seatPosition: number, guestId: string) => {
    if (isGuestSeatedElsewhere(guestId)) {
      setShowReassignWarning({ guestId, seatPosition });
    } else {
      onAssignGuest(guestId, seatPosition);
    }
    setDraggedGuest(null);
  };

  const confirmReassign = () => {
    if (showReassignWarning) {
      onAssignGuest(
        showReassignWarning.guestId,
        showReassignWarning.seatPosition
      );
      setShowReassignWarning(null);
    }
  };

  const guestAtSeat = (position: number) =>
    seatedGuests.find((g) => g.seatPosition === position);

  return (
    <div className="space-y-6">
      {/* Reassign Warning Dialog */}
      <Dialog
        open={!!showReassignWarning}
        onOpenChange={() => setShowReassignWarning(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle className="h-5 w-5" />
              Guest Already Seated
            </DialogTitle>
            <DialogDescription>
              {showReassignWarning && (
                <>
                  <span className="font-medium text-foreground">
                    {
                      guests.find((g) => g.id === showReassignWarning.guestId)
                        ?.name
                    }
                  </span>{" "}
                  is currently seated at{" "}
                  <span className="font-medium text-foreground">
                    {getGuestCurrentTable(showReassignWarning.guestId)?.name}
                  </span>
                  . Moving them here will remove them from their current seat.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowReassignWarning(null)}
            >
              Cancel
            </Button>
            <Button onClick={confirmReassign}>Move Guest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif text-2xl font-semibold text-foreground">
            {table.name}
          </h1>
          <p className="text-muted-foreground">
            {seatedGuests.length} of {table.seats} seats filled
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Table Visualization */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Table Layout</CardTitle>
              <CardDescription>
                Drag guests from the sidebar to assign seats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div
                  className="relative"
                  style={{
                    width: radius * 2 + itemSize + 40,
                    height: radius * 2 + itemSize + 40,
                  }}
                >
                  {/* Table center */}
                  <div
                    className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary/10 border-2 border-primary/30 flex items-center justify-center ${
                      table.type === "rectangle"
                        ? "w-48 h-24 rounded-xl"
                        : table.type === "square"
                        ? "w-32 h-32 rounded-xl"
                        : "w-32 h-32 rounded-full"
                    }`}
                  >
                    <span className="text-sm font-medium text-primary">
                      {table.name}
                    </span>
                  </div>

                  {/* Seats around the table */}
                  {Array.from({ length: table.seats }, (_, i) => {
                    const position = i + 1;
                    const angle = (i / table.seats) * 2 * Math.PI - Math.PI / 2;
                    const x = radius * Math.cos(angle);
                    const y = radius * Math.sin(angle);
                    const guest = guestAtSeat(position);

                    return (
                      <div
                        key={position}
                        className="absolute"
                        style={{
                          left: `calc(50% + ${x}px - ${itemSize / 2}px)`,
                          top: `calc(50% + ${y}px - ${itemSize / 2}px)`,
                          width: itemSize,
                          height: itemSize,
                        }}
                        onDragOver={(e) => {
                          if (!guest) e.preventDefault();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          if (draggedGuest && !guest) {
                            handleDrop(position, draggedGuest);
                          }
                        }}
                      >
                        {guest ? (
                          <div className="relative group">
                            <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium shadow-md">
                              {guest.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <button
                              onClick={() => onRemoveGuest(guest.id)}
                              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3 w-3" />
                            </button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                              {guest.name}
                            </div>
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 rounded-full border-2 border-dashed flex items-center justify-center text-xs text-muted-foreground transition-colors ${
                              draggedGuest
                                ? "border-primary bg-primary/5"
                                : "border-border"
                            }`}
                          >
                            {position}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest List Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Add Guests</CardTitle>
              <div className="relative mt-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search guests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </CardHeader>
            <CardContent className="max-h-[400px] overflow-y-auto space-y-1">
              {allGuestsFiltered.map((guest) => {
                const isSeatedHere = guest.tableId === table.id;
                const isSeatedElsewhere = isGuestSeatedElsewhere(guest.id);
                const currentTable = getGuestCurrentTable(guest.id);

                if (isSeatedHere) return null;

                return (
                  <div
                    key={guest.id}
                    draggable
                    onDragStart={() => setDraggedGuest(guest.id)}
                    onDragEnd={() => setDraggedGuest(null)}
                    className={`flex items-center gap-2 p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                      isSeatedElsewhere
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {guest.name}
                      </p>
                      {isSeatedElsewhere && currentTable && (
                        <p className="text-xs text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Seated at {currentTable.name}
                        </p>
                      )}
                    </div>
                    {!isSeatedElsewhere &&
                      getAvailableSeatPositions().length > 0 && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0"
                          onClick={() =>
                            onAssignGuest(
                              guest.id,
                              getAvailableSeatPositions()[0]
                            )
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                  </div>
                );
              })}
              {allGuestsFiltered.filter((g) => g.tableId !== table.id)
                .length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {searchQuery
                    ? "No guests found"
                    : "All guests are seated at this table"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Seated at this table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">
                Seated Here ({seatedGuests.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {seatedGuests.map((guest) => (
                <div
                  key={guest.id}
                  className="flex items-center justify-between p-2 rounded-lg bg-primary/5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs">
                      {guest.seatPosition}
                    </div>
                    <span className="text-sm">{guest.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveGuest(guest.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {seatedGuests.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No guests seated yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
