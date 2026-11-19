#!/bin/bash
tmpdir=$(mktemp -d)
trap 'kill 0; rm -rf "$tmpdir"; exit 1' INT TERM

i=0

while IFS=';' read -r title url archive; do
    i=$((i + 1))
    n=$i
    
    sleep 10

    if [[ "$url" =~ (youtube\.com/watch|youtu\.be/) ]] && [[ "$archive" != /finds/archive* ]]; then
        (
            if new_archive=$(./find2 "$title" "${url//\\/}"); then
                printf '%s;%s;%s\n' "$title" "$url" "$new_archive"
            else
                printf '%s;%s;%s\n' "$title" "$url" "$archive"
            fi
        ) > "$tmpdir/$n" &
    else
        printf '%s;%s;%s\n' "$title" "$url" "$archive" > "$tmpdir/$n"
    fi
done < tmp.csv

wait

for n in $(seq 1 $i); do
    cat "$tmpdir/$n"
done > tmp.csv # && mv /tmp/finds.csv content/finds/finds.csv

rm -rf "$tmpdir"