package com.findmrotue.fmr.repo.busstop;

import com.findmrotue.fmr.entity.bustop.BusStop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BusStopRepo extends JpaRepository<BusStop, Integer> {
}
