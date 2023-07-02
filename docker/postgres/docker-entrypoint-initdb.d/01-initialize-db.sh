#!/bin/sh

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'wordle_dev'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE wordle_dev"
psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = 'wordle_testing'" | grep -q 1 || psql -U postgres -c "CREATE DATABASE wordle_testing"
