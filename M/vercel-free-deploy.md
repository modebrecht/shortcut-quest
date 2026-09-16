# Vercel Free Deployment Cleanup

Quick snippets for reducing old Vercel deployments without deleting the Vercel project itself.

## 1. Safe cleanup

Vercel removes deployments it considers safe to delete and keeps deployments that are still actively referenced by aliases/domains.

```powershell
vercel remove pocket-factory --safe --yes
```

Use this first when you want a conservative cleanup.

> `--safe` can leave more than one deployment behind. That is expected.

## 2. Hard cleanup: keep only the deployment that is LIVE

This version resolves the deployment currently served by the project's live alias, then deletes every other deployment in that project.

Example for `pocket-factory`:

```powershell
$projectId = "prj_GS5NA9uJdjLJfP7a2s5PSVeMnNC3"
$teamId    = "team_bgCMPzd6v634brLp9mvGrngl"
$scope     = "modebrechts-projects"
$liveAlias = "pocket-factory.vercel.app"

# Resolve the deployment currently serving the live alias.
$live = vercel api "/v13/deployments/$liveAlias?teamId=$teamId" | ConvertFrom-Json
$keep = $live.id

if (-not $keep) {
    throw "Could not resolve live deployment. Nothing deleted."
}

Write-Host "LIVE deployment to keep: $keep" -ForegroundColor Green

# Fetch all deployments for this project.
$all = @()
$until = $null

do {
    $path = "/v6/deployments?projectId=$projectId&teamId=$teamId&limit=100"
    if ($until) { $path += "&until=$until" }

    $data = vercel api $path | ConvertFrom-Json
    $all += @($data.deployments)
    $until = $data.pagination.next
} while ($until)

# Protect against duplicate rows from an inclusive pagination cursor.
$all = @(
    $all |
    Group-Object { if ($_.uid) { $_.uid } else { $_.id } } |
    ForEach-Object { $_.Group[0] }
)

$delete = @(
    $all | Where-Object {
        $id = if ($_.uid) { $_.uid } else { $_.id }
        $id -ne $keep
    }
)

Write-Host "TOTAL:   $($all.Count)"
Write-Host "KEEP:    1" -ForegroundColor Green
Write-Host "DELETE:  $($delete.Count)" -ForegroundColor Yellow

$confirm = Read-Host "Type DELETE exactly to continue"
if ($confirm -cne "DELETE") {
    Write-Host "Cancelled."
    return
}

foreach ($d in $delete) {
    $url = "https://$($d.url)"
    Write-Host "Deleting $url"
    vercel remove $url --yes --scope $scope
}

Write-Host "DONE - live deployment preserved: $keep" -ForegroundColor Green
```

### Reuse for another project

Change only these values:

```powershell
$projectId = "prj_..."
$teamId    = "team_..."
$scope     = "your-team-slug"
$liveAlias = "your-project.vercel.app"
```

## Important

- `vercel remove PROJECT --safe --yes` = conservative cleanup.
- The hard-cleanup script = deletes **everything except the deployment currently serving `$liveAlias`**.
- It does **not** simply keep the newest deployment. This matters when the newest deployment is only a Preview while an older deployment is still Production/live.
- Never use `vercel project rm PROJECT` for deployment cleanup; that removes the project itself.
