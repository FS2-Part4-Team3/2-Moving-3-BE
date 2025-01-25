npx prisma generate

if ! npx prisma migrate deploy; then
    echo ">>>>> Migration failed, attempting reset..."
    npx prisma migrate reset --force
    
    if ! npx prisma migrate deploy; then
        echo ">>>>> Migration failed even after reset. Exiting..."
        exit 1
    fi

    npx prisma db seed
fi

npm run start:prod