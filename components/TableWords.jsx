
"use client"
import Swal from 'sweetalert2'
import {
    CaretSortIcon,
    ChevronDownIcon,
    DotsHorizontalIcon,
} from "@radix-ui/react-icons"
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState } from "react"
import { useRouter } from 'next/navigation'


const TableWords = ({data = []}) => {
    const router = useRouter();

    const columns = [
        {
            accessorKey: "key",
            header: "Clave",
            cell: ({ row }) => (
                <div className="">{row.original[0]}</div>
            ),
        },
        {
            accessorKey: "word",
            header: "Palabra",
            cell: ({ row }) => (
                <div className="">{row.original[1].word}</div>
            ),
        },
        {
            accessorKey: "type",
            header: "Tipo",
            cell: ({ row }) => (
                <div className="">{row.original[1].type}</div>
            ),
        },
        {
            accessorKey: "qualification",
            header: "Calificacion",
            cell: ({ row }) => (
                <div className="">{row.original[1].qualification}</div>
            ),
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const key = row.original[0]
                const aux = row.original[1]
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={()=>handleEditWord(key)}>Editar</DropdownMenuItem> 
                            <DropdownMenuItem onClick={()=>handleDeleteWord(key)}>Eliminar</DropdownMenuItem> 
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]
    
    const handleEditWord = (key)=>{
        localStorage.setItem('clave', key);
        router.push('/palabra/editar')
    }
    
    const handleDeleteWord = async (key)=>{
        const response = await fetch('/api/lexema', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({word:key}),
          });
          const responseBody = await response.json();
          if (responseBody.status === "ok") {
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: responseBody.message,
              showConfirmButton: false,
              timer: 1000
            });
            //esperar y luego recargar
            setTimeout(() => {
                location.reload();
            }, 1000);
          } else {
            Swal.fire({
              icon: "error",
              title: "Error...",
              text: responseBody.message,
              footer: '<a href="/analizador">Verificar en el listado de lexemas</a>'
            });
          }
      
        };
    
    const [sorting, setSorting] = useState([])
    const [columnFilters, setColumnFilters] = useState([])
    const [columnVisibility, setColumnVisibility] = useState({})
    const [rowSelection, setRowSelection] = useState({})
    const [words, setWords] = useState([]);
    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })


    return (
        <div className="w-75">
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {
                        table?.getRowModel()?.rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No existen palabras asignadas.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Anterior
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Siguiente
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default TableWords