import * as React from "react"


const Table = (({ className }) => (
    <div className="w-full overflow-auto">
        <table

            className={`w-full caption-bottom text-sm ${className}`}

        />
    </div>
))
Table.displayName = "Table"

const TableHeader = (({ className }) => (
    <thead className={`[&_tr]:border-b ${className}`} />
))
TableHeader.displayName = "TableHeader"

const TableBody = (({ className }) => (
    <tbody

        className={`[&_tr:last-child]:border-0 ${className}`}

    />
))
TableBody.displayName = "TableBody"

const TableFooter = (({ className }) => (
    <tfoot

        className={`bg-primary font-medium text-primary-foreground ${className}`}

    />
))
TableFooter.displayName = "TableFooter"

const TableRow = (({ className }) => (
    <tr

        className={`border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted ${className}`}

    />
))
TableRow.displayName = "TableRow"

const TableHead = (({ className }) => (
    <th

        className={`h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 ${className}`}

    />
))
TableHead.displayName = "TableHead"

const TableCell = (({ className }) => (
    <td

        className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}

    />
))
TableCell.displayName = "TableCell"

const TableCaption = (({ className }) => (
    <caption

        className={`mt-4 text-sm text-muted-foreground ${className}`}

    />
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}
