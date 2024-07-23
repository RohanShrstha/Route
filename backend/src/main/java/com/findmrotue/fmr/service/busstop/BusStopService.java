package com.findmrotue.fmr.service.busstop;

import com.findmrotue.fmr.entity.bustop.BusStop;

import java.util.List;

public interface BusStopService {

    public BusStop create(BusStop dto);

    public List<BusStop> getAll();

    public BusStop getById(Integer id);

    public BusStop update(BusStop dto);

    public void deleteById(Integer id);
}
